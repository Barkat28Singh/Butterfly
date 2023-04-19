document.addEventListener("DOMContentLoaded", function () {
  console.log("loaded");

  const email = document.getElementById("email");
  const password = document.getElementById("password");
  const signIn = document.getElementById("signIn2");

  signIn.addEventListener("click", function () {
    firebase
      .auth()
      .signInWithEmailAndPassword(email.value, password.value)
      .then(() => {
        const user = firebase.auth().currentUser;
      })
      .catch(() => alert("Please check your credentials"));

    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        //if user logins, tthen send them to index file
        window.location = "/html/User-profile-page.html";
      }
    });
  });
});
