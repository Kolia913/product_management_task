const { prisma } = require("../dbClient");
const dayjs = require("dayjs");

async function calculatePrimeCosts() {
  await prisma.$transaction(async (tx) => {
    const storedOperationsRes =
      await tx.$queryRaw`SELECT to_char(operation_date, 'YYYY-MM') as operation_date, prev_month, array_agg(product_id) as ids 
      FROM "StoredOperations" GROUP BY to_char(operation_date, 'YYYY-MM'), prev_month ORDER BY prev_month;`;

    for (let storedOp of storedOperationsRes) {
      let counter = 0;
      const dateNow = dayjs();
      let storetOpDate = dayjs(storedOp.prev_month);
      while (storetOpDate.isBefore(dateNow)) {
        const presentSimple = getMonthBoundaries(dayjs().toISOString());
        const prevMonth = getMonthBoundaries(storedOp.prev_month);
        const currentMonth = getMonthBoundaries(storedOp.prev_month, 1);
        const now = dayjs().toISOString();

        const monthArrOperations =
          await tx.$queryRaw`SELECT adp.product_id, SUM(adp.quantity)::INT as total_quantity, (array_agg(adp.price))[1] as price,
                                                  SUM(adp.quantity * adp.price)::INT as total
                                                  FROM "ArrivalDocumentProduct" adp
                                                  JOIN "ArrivalDocument" ad ON adp.document_id = ad.id
                                                  WHERE ad.date <= ${presentSimple.startOfMonth.toISOString()}::timestamptz
                                                  AND adp.product_id::text = ANY(string_to_array(${storedOp.ids.join(
                                                    ","
                                                  )}, ',')) GROUP BY adp.product_id;`;
        const monthSaleOperations =
          await tx.$queryRaw`SELECT sdp.product_id, SUM(sdp.quantity)::INT as total_quantity, (array_agg(sdp.price))[1] as price,
                                                  SUM(sdp.quantity * sdp.price)::INT as total
                                                  FROM "SaleDocumentProduct" sdp
                                                  JOIN "SaleDocument" sd ON sdp.document_id = sd.id
                                                  WHERE sd.date <= ${presentSimple.startOfMonth.toISOString()}::timestamptz
                                                  AND sdp.product_id::text = ANY(string_to_array(${storedOp.ids.join(
                                                    ","
                                                  )}, ',')) GROUP BY sdp.product_id;`;

        const primeCostsForPrevMonth =
          await tx.$queryRaw`SELECT * FROM "PrimeCost" pc WHERE pc.date >= ${prevMonth.startOfMonth.toDateString()}::timestamptz
      AND pc.date <  ${prevMonth.endOfMonth.toDateString()}::timestamptz;`;
        const result = [];
        for (let op of storedOp.ids) {
          const foundArrOp = monthArrOperations.find(
            (item) => item.product_id === op
          );
          const foundSaleOp = monthSaleOperations.find(
            (item) => item.product_id === op
          );
          const productPrimeCostItem = primeCostsForPrevMonth.find(
            (item) => item.product_id === op
          );
          const productPrimeCost = productPrimeCostItem
            ? productPrimeCostItem.value
            : 0;
          const rest_total =
            productPrimeCost *
            (foundArrOp
              ? foundArrOp.total_quantity
              : 0 - foundSaleOp
              ? foundArrOp.total_quantity
              : 0);

          // ------------

          const currMonthArrOperations =
            await tx.$queryRaw`SELECT adp.product_id, SUM(adp.quantity)::INT as total_quantity,
                                                  SUM(adp.quantity * adp.price)::INT as total
                                                  FROM "ArrivalDocumentProduct" adp
                                                  JOIN "ArrivalDocument" ad ON adp.document_id = ad.id
                                                  WHERE ad.date >= ${currentMonth.startOfMonth.toISOString()}::timestamptz
                                                  AND ad.date < ${currentMonth.endOfMonth.toISOString()}::timestamptz
                                                  AND adp.product_id::text = ANY(string_to_array(${storedOp.ids.join(
                                                    ","
                                                  )}, ',')) GROUP BY adp.product_id;`;
          const currProductMonthTotalPrice = currMonthArrOperations.find(
            (item) => item.product_id === op
          );

          const allArrOperations =
            await tx.$queryRaw`SELECT adp.product_id, SUM(adp.quantity)::INT as total_quantity, (array_agg(adp.price))[1] as price,
                                                  SUM(adp.quantity * adp.price)::INT as total
                                                  FROM "ArrivalDocumentProduct" adp
                                                  JOIN "ArrivalDocument" ad ON adp.document_id = ad.id
                                                  WHERE ad.date <= ${now}::timestamptz
                                                  AND adp.product_id::text = ANY(string_to_array(${storedOp.ids.join(
                                                    ","
                                                  )}, ',')) GROUP BY adp.product_id;`;
          const allSaleOperations =
            await tx.$queryRaw`SELECT sdp.product_id, SUM(sdp.quantity)::INT as total_quantity, (array_agg(sdp.price))[1] as price,
                                                  SUM(sdp.quantity * sdp.price)::INT as total
                                                  FROM "SaleDocumentProduct" sdp
                                                  JOIN "SaleDocument" sd ON sdp.document_id = sd.id
                                                  WHERE sd.date <= ${now}::timestamptz
                                                  AND sdp.product_id::text = ANY(string_to_array(${storedOp.ids.join(
                                                    ","
                                                  )}, ',')) GROUP BY sdp.product_id;`;

          const foundArrOpNow = monthArrOperations.find(
            (item) => item.product_id === op
          );
          const foundSaleNow = monthSaleOperations.find(
            (item) => item.product_id === op
          );

          const totalNow = foundArrOpNow
            ? foundArrOpNow.total
            : 0 - foundSaleNow
            ? foundSaleNow.total
            : 0;

          const resultPrice =
            (rest_total + currProductMonthTotalPrice?.total || 0) / totalNow > 0
              ? totalNow
              : 1;

          result.push({
            product_id: op,
            date: dayjs(storedOp.prev_month)
              .add(1, "month")
              .set("date", 1)
              .toISOString(),
            value: resultPrice,
          });
        }
        for (let rs of result) {
          await tx.primeCost.upsert({
            where: {
              product_id: rs.product_id,
            },
            update: {
              date: rs.date,
              value: rs.value,
            },
            create: {
              ...rs,
            },
          });
        }
        storetOpDate = storetOpDate.add(1, "month");
      }
    }
  });
}

function getMonthBoundaries(timestamp, additionalMonths = 0) {
  const givenTimestamp = dayjs(timestamp).add(additionalMonths, "month");

  const startOfMonth = givenTimestamp.startOf("month").toDate();
  const endOfMonth = givenTimestamp.endOf("month").toDate();
  return {
    startOfMonth,
    endOfMonth,
  };
}

module.exports = {
  calculatePrimeCosts,
};
