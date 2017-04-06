export default json => {
  try {
    return JSON.stringify(json);
  } catch (error) {
    return "{}";
  }
};
