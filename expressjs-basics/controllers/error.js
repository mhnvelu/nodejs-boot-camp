exports.get404 = (req, res, next) => {
  console.log("Error endpoint");
  res.status(404).render("error", { pageTitle: "Error" });
};
