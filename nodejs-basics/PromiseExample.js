const p1 = () => {
  return new Promise((resolve, reject) => {
    resolve("p1");
  });
};

const p2 = () => {
  return new Promise((resolve, reject) => {
    resolve("p2");
    // reject("p2");
  });
};

const p3 = () => {
  return new Promise((resolve, reject) => {
    resolve("p3");
  });
};

const p4 = () =>
  p1()
    .then((data) => {
      console.log("P4", data);
    })
    .catch((err) => console.log("p4 err", err));

const p5 = () => {
  console.log(p4());
  // p4()
  //   .then((data) => {
  //     console.log("P5", data);
  //   })
  //   .catch((err) => console.log("p5 err", err));
};

p5();
