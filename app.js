const getCurrencyOptions = async () => {
  const apiUrl = "https://api.exchangerate.host/symbols";
  const res = await fetch(apiUrl);
  const data = await res.json();
  return data.symbols;

  // return  fetch(apiUrl)
  //   .then((res) => res.json())
  //   .then((data) => data.symbols);
};

const getCurrencyRates = async (fromCurrency, toCurrency) => {
  const apiUrl = "https://api.exchangerate.host/convert?base=NGN";
  const currencyConvertUrl = new URL(apiUrl);
  currencyConvertUrl.searchParams.append("from", fromCurrency);
  currencyConvertUrl.searchParams.append("to", toCurrency);

  const result = fetch(currencyConvertUrl)
    .then((response) => response.json())
    .then((data) => data.result);
  return result;
};

// getCurrencyRates('USD', 'NGN')

const appendOptionsElToSelectEl = (optionItem, selectEl) => {
  const optionEl = document.createElement("option");
  optionEl.value = optionItem.code;
  optionEl.textContent = optionItem.description;
  selectEl.appendChild(optionEl);
};

const populateSelectEl = (selectEl, optionItems) => {
  optionItems.forEach((optionItem) =>
    appendOptionsElToSelectEl(optionItem, selectEl)
  );
};

const setUpCurrencies = async () => {
  const fromCurrency = document.querySelector("#fromCurrency");
  const toCurrency = document.querySelector("#toCurrency");

  const currencyOptions = await getCurrencyOptions();
  const currenciesArray = Object.keys(currencyOptions);
  const currencies = currenciesArray.map(
    (currencyKeys) => currencyOptions[currencyKeys]
  );
  // console.log(currencies);

  populateSelectEl(fromCurrency, currencies);
  populateSelectEl(toCurrency, currencies);
};

setUpCurrencies();

const setUpEventListener = () => {
  const formEl = document.querySelector("#convert");
  formEl.addEventListener("submit", async (event) => {
    event.preventDefault();

    const fromCurrency = document.querySelector("#fromCurrency");
    const toCurrency = document.querySelector("#toCurrency");
    const amount = document.querySelector("#amount");
    const convertResultEl = document.querySelector("#result");

    try {
      const rates = await getCurrencyRates(
        fromCurrency.value,
        toCurrency.value
      );
      const amountValue = Number(amount.value);
      const conversionRate = Number(amountValue * rates).toFixed(2); // remove fixed

      convertResultEl.textContent = `${amountValue} ${fromCurrency.value} = ${conversionRate} ${toCurrency.value}`;
    } catch (err) {
      convertResultEl.textContent = `There is an error : ${err.message}`;
      convertResultEl.classList.add("error");
    }
  });
};

setUpEventListener();
