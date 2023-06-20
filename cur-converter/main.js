const amount = document.getElementById("amount"),
  select = document.querySelectorAll(".select"),
  from = document.getElementById("from"),
  to = document.getElementById("to"),
  result = document.getElementById("rate"),
  convertBtn = document.getElementById("convert-icon"),
  calculateBtn = document.querySelector(".convert");

  async function getRate() {
    const response = await fetch(`https://api.exchangerate.host/latest?base=USD`);
    var data = await response.json();
    const rates = data.rates;
    if (response) {
      updateOptions(from, getList(rates));
      updateOptions(to, getList(rates));
    } else {
      throw new Error(response.status);
    }
  }
getRate();

function getList(rates) {
  return Object.keys(rates).map((item) => {
    const li = document.createElement("li");
    li.innerHTML = `<span>${item}</span>`;
    li.addEventListener("click", (event) => {
      const selectedListItem = event.target;
      const parentSpan = selectedListItem.parentElement.parentElement.querySelector("span");
      parentSpan.innerHTML = item;
      selectedListItem.parentElement.querySelectorAll("li").forEach((li) => {
        li.classList.remove("active");
      });
      selectedListItem.classList.add("active");
      calculate();
    });

    return li;
  });
}


function updateOptions(select, options) {
  ul = document.createElement("ul");
  options.forEach((option) => {
    ul.appendChild(option);
  });
  select.appendChild(ul);
}

async function calculate() {
  if (amount.value === "" || amount.value === "0") {
    return;
  }
  calculateBtn.innerHTML = "Calculating...";
  calculateBtn.disabled = true;
  const fromCurrency = from.querySelector("span").innerHTML;
  const toCurrency = to.querySelector("span").innerHTML;
  const fromAmount = amount.value;
  try {
    const response = await fetch(`https://api.exchangerate.host/latest?base=${fromCurrency}&symbols=${toCurrency}&amount=${amount.value}&places=2`);
    if (!response.ok) {
      throw new Error(response.status);
    }
    const data = await response.json();
    const rate = data.rates[toCurrency];
    result.innerHTML = `${rate} ${toCurrency}`;
  } catch (error) {
    console.error(error);
  } finally {
    calculateBtn.innerHTML = "Convert";
    calculateBtn.disabled = false;
  }
}


select.forEach((item) => [
  item.addEventListener("click", () => {
    item.classList.toggle("active");
  }),
]);

document.addEventListener("click", (e) => {
  if (!e.target.closest(".select")) {
    select.forEach((item) => {
      item.classList.remove("active");
    });
  }
});

amount.addEventListener("input", function () {
  this.value = this.value.replace(/[^0-9.]/g, "");
  calculate();
});

calculateBtn.addEventListener("click", () => {
  calculate();
});

convertBtn.addEventListener("click", () => {
  const fromSelected = from.querySelector("span").innerHTML;
  const toSelected = to.querySelector("span").innerHTML;
  from.querySelector("span").innerHTML = toSelected;
  to.querySelector("span").innerHTML = fromSelected;
  calculate();
});