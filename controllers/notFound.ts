export default ({ response }: any) => {
  response.status = 404;
  response.body = {
    message: "Not Found",
  };
};
