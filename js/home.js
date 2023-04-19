document.addEventListener("DOMContentLoaded", function () {
  console.log("loaded");

  const firstname = document.getElementById("firstname");
  const lastname = document.getElementById("lastname");
  const email = document.getElementById("email");
  const username = document.getElementById("username");
  const password = document.getElementById("password");
  const phonenum = document.getElementById("number");
  const signUp = document.getElementById("signUp2");

  //Signing up or Registering a user and automatically signs in that user

  function addUserToDb(uid, first, last, em, usernm, pass, phone) {
    firebase
      .firestore()
      .collection("Users")
      .doc(uid)
      .set({
        //Getting the id of the user that signs-up
        userId: uid,
        firstname: first,
        lastname: last,
        email: em,
        username: usernm,
        password: pass,
        phonenum: phone,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then(() => {
        console.log("User added to DB successfully!");
        window.location = "/html/User-profile-page.html";
      })
      .catch((error) => {
        console.log("error add user to db", console.error());
      });
  }
  signUp.addEventListener("click", function () {
    if (
      firstname.value &&
      lastname.value &&
      email.value &&
      username.value &&
      password.value &&
      phonenum.value
    ) {
      console.log("Clicked sign Up");
      firebase
        .auth()
        .createUserWithEmailAndPassword(email.value, password.value)
        .then(() => {
          const user = firebase.auth().currentUser; //Gives info of the user who is just registered
          addUserToDb(
            user.uid,
            firstname.value,
            lastname.value,
            email.value,
            username.value,
            password.value,
            phonenum.value
          ); //Adding to the db
          console.log("User Signed Up successfully!");
        }) //Registers the user
        .catch((error) =>
          alert(
            "Fill all fields and password should have atleast 6 characters."
          )
        );
    }
  });
});
