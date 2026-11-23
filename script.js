const display = document.getElementById("display");
const expression = document.getElementById("expression");
const keypad = document.getElementById("keypad");
const historyList = document.getElementById("historyList");
const toast = document.getElementById("toast");
let current = "0";
let storedExpression = "";
let justCalculated = false;
let history = [];

const operators = ["+", "−", "×", "÷"];
function render() { display.textContent = current; expression.textContent = storedExpression || "Ready for your calculation"; }
function notify(message) { toast.textContent = message; toast.classList.add("show"); setTimeout(() => toast.classList.remove("show"), 1800); }
function clearAll() { current = "0"; storedExpression = ""; justCalculated = false; render(); }
function append(value) {
  if (justCalculated && !operators.includes(value)) { current = "0"; storedExpression = ""; }
  justCalculated = false;
  if (operators.includes(value)) {
    if (current === "Error") current = "0";
    if (operators.includes(current.slice(-1))) current = current.slice(0,-1) + value;
    else current += value;
  } else if (value === ".") {
    const lastNumber = current.split(/[+−×÷]/).pop();
    if (lastNumber.includes(".")) return;
    current += ".";
  } else {
    if (current === "0" || current === "Error") current = value;
    else current += value;
  }
  if (current.length > 28) current = current.slice(0,28);
  render();
}
function deleteLast() { if (justCalculated) { clearAll(); return; } current = current.length > 1 ? current.slice(0,-1) : "0"; if (current === "-") current = "0"; render(); }
function percent() {
  const match = current.match(/(\d*\.?\d+)$/);
  if (!match) return;
  const value = String(Number(match[0]) / 100);
  current = current.slice(0, -match[0].length) + value;
  render();
}
function safeCalculate(source) {
  let normalized = source.replace(/×/g,"*").replace(/÷/g,"/").replace(/−/g,"-").replace(/\s/g,"");
  if (!/^[0-9.+*/-]+$/.test(normalized) || !/[0-9]$/.test(normalized)) throw new Error("Invalid expression");
  const tokens = normalized.match(/(?:\d+\.?\d*|\.\d+)|[+\-*/]/g);
  if (!tokens || tokens.join("") !== normalized) throw new Error("Invalid expression");
  let nums = [], ops = [], expectNumber = true;
  for (let i=0;i<tokens.length;i++) {
    const t = tokens[i];
    if (expectNumber) {
      if (t === "-" && i+1 < tokens.length && !isNaN(Number(tokens[i+1]))) { nums.push(-Number(tokens[++i])); expectNumber = false; }
      else if (!isNaN(Number(t))) { nums.push(Number(t)); expectNumber = false; }
      else throw new Error("Invalid expression");
    } else {
      if (!["+","-","*","/"].includes(t)) throw new Error("Invalid expression");
      ops.push(t); expectNumber = true;
    }
  }
  if (expectNumber) throw new Error("Incomplete expression");
  for (let i=0;i<ops.length;) {
    if (ops[i] === "*" || ops[i] === "/") {
      const a=nums[i], b=nums[i+1];
      if (ops[i] === "/" && b === 0) throw new Error("Cannot divide by zero");
      nums.splice(i,2,ops[i] === "*" ? a*b : a/b); ops.splice(i,1);
    } else i++;
  }
  let result=nums[0];
  for(let i=0;i<ops.length;i++) result = ops[i] === "+" ? result+nums[i+1] : result-nums[i+1];
  if (!Number.isFinite(result)) throw new Error("Invalid result");
  return Number(result.toPrecision(12)).toString();
}
function calculate() {
  const source = current;
  try {
    const answer = safeCalculate(source);
    storedExpression = source + " =";
    current = answer;
    justCalculated = true;
    addHistory(source, answer);
    render();
  } catch (error) { notify(error.message === "Cannot divide by zero" ? error.message : "Please enter a valid calculation"); }
}
function addHistory(expr, result) {
  history.unshift({expr,result}); history = history.slice(0,8);
  historyList.innerHTML = "";
  history.forEach(item => {
    const row = document.createElement("button");
    row.className = "history-item"; row.type = "button";
    const left = document.createElement("span"); left.className = "history-expression"; left.textContent = item.expr;
    const right = document.createElement("span"); right.className = "history-result"; right.textContent = item.result;
    row.append(left,right); row.addEventListener("click",()=>{current=item.result;storedExpression=item.expr+" =";justCalculated=true;render();});
    historyList.append(row);
  });
}
keypad.addEventListener("click", event => {
  const button = event.target.closest("button"); if (!button) return;
  const action = button.dataset.action, value = button.dataset.value;
  if (action === "clear") clearAll();
  else if (action === "delete") deleteLast();
  else if (action === "percent") percent();
  else if (action === "equals") calculate();
  else if (value !== undefined) append(value);
});
document.addEventListener("keydown", event => {
  if (/^[0-9.]$/.test(event.key)) append(event.key);
  else if (event.key === "+") append("+");
  else if (event.key === "-") append("−");
  else if (event.key === "*") append("×");
  else if (event.key === "/") { event.preventDefault(); append("÷"); }
  else if (event.key === "Enter" || event.key === "=") { event.preventDefault(); calculate(); }
  else if (event.key === "Backspace") deleteLast();
  else if (event.key === "Escape") clearAll();
});
document.getElementById("clearHistory").addEventListener("click",()=>{history=[];historyList.innerHTML='<p class="empty-history">Your calculations will appear here.</p>';});
document.getElementById("themeToggle").addEventListener("click",()=>document.body.classList.toggle("light"));
render();
