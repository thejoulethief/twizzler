console.log("hello");

const form = document.querySelector("form");
const kitty = document.querySelector(".loading");
const posts = document.querySelector(".posts");

const API_URL = "https://twizzler-api.herokuapp.com/twizz";

form.style.display = "none";
kitty.style.display = "";
getposts();

form.addEventListener("submit", event => {
  event.preventDefault();
  const formData = new FormData(form);
  const name = formData.get("name");
  const twizz = formData.get("twizz");

  const content = {
    name: name,
    twizz: twizz
  };

  form.style.display = "none";
  kitty.style.display = "";

  fetch(API_URL, {
    method: "POST",
    body: JSON.stringify(content),
    headers: {
      "content-type": "application/json"
    }
  })
    .then(() => {
      setTimeout(delayMe, 2000);
    })
    .catch(() => {
      throw error("Not a valid input");
    });
});

function delayMe() {
  form.style.display = "";
  kitty.style.display = "none";
  //window.open("http://127.0.0.1:8080/", "_self");
  //window.location.reload();
}

function getposts() {
  // try {
  //   div.innerHTML = "";
  // } catch {}

  fetch(API_URL)
    .then(response => response.json())
    .then(mews => {
      mews.reverse();
      mews.forEach(function(mew) {
        const div = document.createElement("div");

        const h3 = document.createElement("h3");
        const span = document.createElement("span");
        const a = document.createElement("a");
        const p = document.createElement("p");
        const time = document.createElement("p");

        //Profile link
        a.href = `/profiles/${mew.name}`;

        //Time
        time.className = "time";
        time.textContent = mew.time.replace(/T/, " ").replace(/\..+/, "");

        //Username
        span.className = "username";
        span.innerText = `@${mew.name}`;

        a.appendChild(span);

        //Name
        h3.textContent = mew.name;

        //Message/Twizz
        p.textContent = mew.twizz;

        //Class
        div.className = "post";

        div.appendChild(h3);
        div.appendChild(a);
        div.appendChild(p);
        div.appendChild(time);

        posts.appendChild(div);
      });
    });

  kitty.style.display = "none";
  form.style.display = "";
}
