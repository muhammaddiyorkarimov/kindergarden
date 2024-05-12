function setCookie() {
  let u = document.getElementById("username").value;
  let p = document.getElementById("password").value;

  document.cookie = "myusername=" + u + "; path = http://localhost/web6pm/";
  document.cookie = "mypassword=" + p + "; path = http://localhost/web6pm/";
}

function getcookiedata() {
  console.log(document.cookie);
}

export default setCookie;
