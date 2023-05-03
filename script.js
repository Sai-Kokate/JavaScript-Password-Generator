const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyMessage = document.querySelector("[data-copyMessage]");
const copyButton = document.querySelector("[data-copyButton]");
const lengthCount = document.querySelector("[password-lengthCount]");
const lengthSlider = document.querySelector("[password-lengthSlider]");
const strengthIndicator = document.querySelector("[password-strengthIndicator]");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const passwordButton = document.querySelector(".generate-password");


// Intializing Variables
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';
let password = "";
let passwordLength =10;
let checkCount = 0;

// Setting initial strength color to gray
setSrength("#ccc");

// Creating Functions

// Setting Password Length
function handleLength() {
  lengthSlider.value  = passwordLength;
  lengthCount.innerText = passwordLength;
  // Adding styling to the slider by changing background size according to the passwordLength value
  const min = lengthSlider.min;
  const max = lengthSlider.max;
  lengthSlider.style.backgroundSize = ( (passwordLength - min)*100/(max - min)) + "% 100%";
}

// Function Call
handleLength();

// Setting strength color
function setSrength(color){
  strengthIndicator.style.backgroundColor = color;
  // set shadow
  strengthIndicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

// Random integer generator between min and max
function getRandomInt(min, max) {
  return Math.floor(Math.random()*(max-min)) + min;
}

// Function to generate random number between 0-9
function generateRandomNumber(){
  return getRandomInt(0,9);
}

// Function to generate random lowercase characters between a-z
function generateLowercase(){
  return String.fromCharCode(getRandomInt(97,123));
}

// Function to generate random uppercase characters between A-Z
function generateUppercase(){
  return String.fromCharCode(getRandomInt(65,91));
}

// Function to generate random character from the symbols array
function generateSymbol() {
  const randNum = getRandomInt(0, symbols.length);
  return symbols.charAt(randNum);
}

// Function for calculating strength
function calcStrength() {
  let hasUpper = false;
  let hasLower = false;
  let hasNum = false;
  let hasSym = false;
  if (uppercaseCheck.checked) hasUpper = true;
  if (lowercaseCheck.checked) hasLower = true;
  if (numbersCheck.checked) hasNum = true;
  if (symbolsCheck.checked) hasSym = true;

  if (hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
    setSrength("#0f0");
  } else if (
    (hasLower || hasUpper) &&
    (hasNum || hasSym) &&
    passwordLength >= 6
  ) {
    setSrength("#ff0");
  } else {
    setSrength("#f00");
  }
  console.log("Function Executed for calculating strength - calcStrength()")
}

// Function for copying the generated password

async function copyContent(){
  try{
    await navigator.clipboard.writeText(passwordDisplay.value); // copying the value present in passwordDisplay to clipboard 
    copyMessage.innerText = "copied";
  }
  catch(e){
    copyMessage.innerText ="failed to copy";
  }
  // To make the copymessage visible to 2 second
  copyMessage.classList.add("active");

  setTimeout(() => {
    copyMessage.classList.remove("active");
  }, 2000);
}

// Function for shuffeling the password
function shufflePassword(array){
  //Fisher Yates Method
  for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = array[i];
      array[i] = array[j];
      array[j] = temp;
    }
  let str = "";
  array.forEach((el) => (str += el));
  console.log("Executed Function: shufflePassword");
  return str;
  
}

// Adding Event Listners

// Reflect the change in slider (password length)
lengthSlider.addEventListener('input', (change) => {
  passwordLength = change.target.value; //stores the changed value in the variable
  handleLength(); // updates the values
});

// Copy button listner
copyButton.addEventListener('click', () => {
  if(passwordDisplay.value)  //if the value in passwordDisplay is not blank   
    copyContent();
});

// Handling Checkbox change function
function handleCheckBoxChange(){
  checkCount = 0;
  allCheckBox.forEach((checkboxes) =>{
    if(checkboxes.checked)
      checkCount++;
  });

  // Checking condition where password length is less than no. of checkboxes checked
  if(passwordLength<checkCount){
    passwordLength=checkCount;
    handleSlider();
  }
}

allCheckBox.forEach((checkboxes) => {
  checkboxes.addEventListener('change', handleCheckBoxChange);  
})

// Generating Password after clicking on button
passwordButton.addEventListener('click', () =>{
  
  // Initial Checking on Password Length
  if(passwordLength<=0)
    return;
  
  if(passwordLength<checkCount){
    passwordLength=checkCount;
    handleSlider();
  }
  console.log("Completed: Initial Checking on Password Length");

  // Initalizing password to blank
  password="";

  // Adding compulsary initial characters to password
  let funcArr = [];

  if(uppercaseCheck.checked){
    funcArr.push(generateUppercase);
  }

  if(lowercaseCheck.checked){
    funcArr.push(generateLowercase);
  }

  if(numbersCheck.checked){
    funcArr.push(generateRandomNumber);
  }

  if(symbolsCheck.checked){
    funcArr.push(generateSymbol);
  }

  // Loop for adding copulsory inital characters based on the checkboxes checked
  for(let i=0; i<funcArr.length; i++){
    password += funcArr[i]();
  }

  console.log("Completed: adding copulsory inital characters");

  // Adding remaining characters

  for(let i=0; i<passwordLength-funcArr.length; i++){
    randInt = getRandomInt(0, funcArr.length);
    password += funcArr[randInt]();
  }
  console.log("Completed: Adding remaining characters");

  //shuffling the password
  password = shufflePassword(Array.from(password));

  // Displaying the password on UI
  passwordDisplay.value = password;
  console.log("Displaying password");

  // Calculating the Password Strength
  calcStrength();
  
} );