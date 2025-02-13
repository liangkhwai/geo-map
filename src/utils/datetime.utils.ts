const { DateTime } = require('luxon');
export const convertISOToAsia = (datetime: string | null) => {
  if (datetime === null) return null;
  return DateTime.fromISO(datetime).setZone('Asia/Bangkok').toISO();
};

export const convertResponseDateTimeArray = (response: any) => {
  console.log(response);
  const updatedResults = response.map((result) => {
    return {
      ...result,
      createdAt: convertISOToAsia(result.createdAt),
      updatedAt: convertISOToAsia(result.updatedAt),
    };
  });

  return updatedResults;
};
// export const convertResponseDateTimeObject = (response) => {
//   console.log(typeof response.createdAt);
//   console.log(response.createdAt);
//   const updatedResults = {
//     ...response,
//     createdAt: convertISOToAsia(new Date(response.createdAt)),
//     updatedAt: convertISOToAsia(new Date(response.updatedAt)),
//   };

//   return updatedResults;
// };
