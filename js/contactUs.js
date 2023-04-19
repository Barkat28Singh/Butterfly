document.addEventListener("DOMContentLoaded", function () {
  const db = firebase.firestore();
  const formDiv = document.getElementById("contact-form");
  const nameDiv = document.getElementById("name");
  const emailDiv = document.getElementById("email");
  const subjectDiv = document.getElementById("subject");
  const messageDiv = document.getElementById("message");

  // SUBMIT FORM

  formDiv.addEventListener("submit", (e) => {
    e.preventDefault();
    if (nameDiv.value && emailDiv && subjectDiv && messageDiv) {
      contactUs(
        nameDiv.value,
        emailDiv.value,
        subjectDiv.value,
        messageDiv.value
      );
    } else {
      alert("Please complete the form to contact us");
    }
  });

  // ADD POST

  const contactUs = (name, email, subject, message) => {
    db.collection("Contact Us")
      .add({
        name: name,
        email: email,
        subject: subject,
        message: message,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      })
      .then((docRef) => {
        console.log("Post added successfully", docRef.id);
        nameDiv.value = "";
        emailDiv.value = "";
        subjectDiv.value = "";
        messageDiv.value = "";
      })
      .catch((error) => {
        console.log("Error adding post", error);
      });
  };

  const logout = document.getElementById("logout");

  logout.addEventListener("click", function () {
    firebase.auth().onAuthStateChanged(function (user) {
      if (user) {
        //if user exist, that is logged in then sign them out
        firebase.auth().signOut();
      }
      window.location = "/html/home-signin.html";
    });
  });
});
