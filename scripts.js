const selects = document.querySelectorAll(".dropdowns select");
const btn = document.querySelector("button");
const fromSelect = document.querySelector(".from select");
const toSelect = document.querySelector(".to select");
const input = document.querySelector(".input input");
const msg = document.querySelector(".msg");
const spinner = document.querySelector(".spinner");
const icon = document.querySelector("i");
const fromSearch = document.querySelector(".from-search");
const toSearch = document.querySelector(".to-search");

for (let select of selects) {
  for (let code in countryList) {
    let newOption = document.createElement("option");
    newOption.value = code;
    newOption.innerText = code;
    select.append(newOption);
    if (select.name === "from" && newOption.value == "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && newOption.value == "PKR") {
      newOption.selected = "selected";
    }
  }
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
    getData();
  });
}

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  fromSearch.value = "";
  toSearch.value = "";
  getData();
});

fromSearch.addEventListener("input", (evt) => {
  filterOptions(evt.target, fromSelect);
});
toSearch.addEventListener("input", (evt) => {
  filterOptions(evt.target, toSelect);
});
getData();

function filterOptions(input, select) {
  let searchCurr = input.value.toUpperCase();
  for (let option of select.options) {
    let optionVal = option.value;
    option.style.display = optionVal.includes(searchCurr) ? "" : "none";
    if (optionVal === searchCurr) {
      option.selected = "selected";
      getData();
      updateFlag(select);
      filterOptions(input, select);
    }
  }
}

function updateFlag(select) {
  let flagImg = select.parentElement.querySelector("img");
  let contCode = countryList[select.value].code;
  let countryName =
    select.name === "from"
      ? document.querySelector(".code-name1 .country")
      : document.querySelector(".code-name2 .country");
  let currencyName =
    select.name === "from"
      ? document.querySelector(".code-name1 .currency")
      : document.querySelector(".code-name2 .currency");
  newSrc = `https://flagsapi.com/${contCode}/flat/64.png`;
  flagImg.src = newSrc;
  countryName.innerText = countryList[select.value].country;
  currencyName.innerText = countryList[select.value].currency;
}

async function getData() {
  let fromCurr = fromSelect.value;
  let toCurr = toSelect.value;
  let URL = `https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/${fromCurr.toLowerCase()}.json`;

  msg.innerHTML = ""; // clear text
  spinner.style.display = "block"; // show spinner
  fromSearch.value = "";
  toSearch.value = "";
  filterOptions(fromSearch, fromSelect);
  try {
    let response = await fetch(URL);
    if (!response.ok) throw new Error("Network response failed");
    let data = await response.json();
    let rate = data[fromCurr.toLowerCase()][toCurr.toLowerCase()];
    getExchangeRate(fromCurr, toCurr, rate);
  } catch (error) {
    msg.innerHTML = error.message;
  } finally {
    spinner.style.display = "none";
  }
}

function getExchangeRate(fromCurr, toCurr, rate) {
  let amt = input.value;
  if (amt === "" || amt < 1) {
    input.value = 1;
    amt = 1;
  }
  let totalAmt = amt * rate;
  msg.innerHTML = `${amt} ${fromCurr} <b>=</b> ${totalAmt.toFixed(
    2
  )} ${toCurr}`;
}
icon.addEventListener("click", () => {
  swipCurr();
});

function swipCurr() {
  let fromCurr = fromSelect.value;
  let toCurr = toSelect.value;
  fromSelect.value = toCurr;
  toSelect.value = fromCurr;
  updateFlag(fromSelect);
  updateFlag(toSelect);
  getData();
}
