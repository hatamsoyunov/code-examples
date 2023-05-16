export const isTrue = (value: any) => {
  if (typeof value === 'string') {
    return !!value.trim() === true;
  }

  return !!value === true;
};

export const arrayHasItems = (data: any[]) => {
  return isTrue(data?.length);
};
