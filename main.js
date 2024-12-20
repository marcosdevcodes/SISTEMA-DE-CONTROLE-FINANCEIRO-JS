// Funções de banco de dados primeiro
const getItensBD = () => JSON.parse(localStorage.getItem("db_items")) ?? [];
const setItnsDB = () => localStorage.setItem("db_items", JSON.stringify(items));

// Inicialização de variáveis e DOM
const tbody = document.querySelector("tbody");
const descItem = document.querySelector("#desc");
const amount = document.querySelector("#amount");
const type = document.querySelector("#type");
const btnNew = document.querySelector("#btnNew");

const incomes = document.querySelector(".incomes");
const expense = document.querySelector(".expense");
const total = document.querySelector(".total");

// Inicialização do banco de dados local
if (!localStorage.getItem("db_items")) {
  localStorage.setItem("db_items", JSON.stringify([]));
}

let items = getItensBD();

// Eventos
btnNew.addEventListener("click", function () {
  if (descItem.value === "" || amount.value === "" || type.value === "") {
    return alert("Preencha todos os Campos!");
  }

  items.push({
    desc: descItem.value,
    amount: Math.abs(Number(amount.value)).toFixed(2),
    type: type.value,
  });

  setItnsDB();
  loadItns();

  descItem.value = "";
  amount.value = "";
});

// Funções principais
function deleteItem(index) {
  items.splice(index, 1);
  setItnsDB();
  loadItns();
}

function insertItem(item, index) {
  let tr = document.createElement("tr");

  tr.innerHTML = `
        <td>${item.desc}</td>
        <td>R$ ${item.amount}</td>
        <td class="columnType">
            ${
              item.type === "Entrada"
                ? '<box-icon class="btnCima" name="chevron-up"></box-icon>'
                : '<box-icon class="btnBaixo" name="chevron-down"></box-icon>'
            }
        </td>
        <td class="columnAction">
            <button onclick="deleteItem(${index})">
                <box-icon class="delete" name="trash"></box-icon>
            </button>
        </td>
    `;

  tbody.appendChild(tr);
}

function loadItns() {
  items = getItensBD();
  tbody.innerHTML = "";
  items.forEach((item, index) => {
    insertItem(item, index);
  });

  getTotals();
}

function getTotals() {
  const amountIncomes = items
    .filter((item) => item.type === "Entrada")
    .map((transaction) => Number(transaction.amount));

  const amountExpenses = items
    .filter((item) => item.type === "Saida")
    .map((transaction) => Number(transaction.amount));

  const totalIncomes = amountIncomes
    .reduce((acc, cur) => acc + cur, 0)
    .toFixed(2);

  const totalExpenses = Math.abs(
    amountExpenses.reduce((acc, cur) => acc + cur, 0)
  ).toFixed(2);

  const totalItems = (totalIncomes - totalExpenses).toFixed(2);

  incomes.innerHTML = totalIncomes;
  expense.innerHTML = totalExpenses;
  total.innerHTML = totalItems;
}

// Inicializar tabela ao carregar
loadItns();
