const displayUpper = document.getElementById('display1');
const displayLower = document.getElementById('display2');
const btns = document.querySelectorAll('.btn');

//History
const histTemplate = document.getElementById('history-template');
const histUpper = document.getElementById('history-upper');
const histBody = document.getElementById('history-body');
const histClear = document.getElementById('logo-box');
const histText = document.getElementById('hist-text');

//When history clear (logo-box) is clicked event
histClear.addEventListener('click', ()=>{
    while(histBody.firstChild){
        histBody.removeChild(histBody.firstChild);
    }
    histBody.appendChild(histText);
    createHistoryMarginBottom();
})


//History logo
const historyLogo = document.getElementById('logoHistory');

//If history logo is clicked then history template will open
historyLogo.addEventListener('click', ()=>{
    histTemplate.style.display = 'block';
})

//If history template (the upper dark part) is clicked then history template will close
histUpper.addEventListener('click', ()=>{
    histTemplate.style.display = 'none';
})

//If an history item is click then it will display on the display screen
var historyItems = histBody.childNodes;

histBody.addEventListener('click', (event)=>{
    // alert(event.target);
    var clickedElement = event.target;
    for(let i=0; i<historyItems.length; i++){
        if(clickedElement.parentNode === historyItems[i]){
            // alert(historyItems[i].textContent);
            
            displayUpper.innerText = historyItems[i].firstChild.textContent;
            displayLower.innerText = historyItems[i].lastChild.textContent;
            histTemplate.style.display = 'none';
        }
    }
})



var isOpClicked = false, isEqualClicked = false;
const nums = new Array(2);
nums[0] = 0;
nums[1] = 0;
var operator = '';
var answer;
var equalClicks = 0;
var threeNumClicks = 0;
btns.forEach(function(btn){
    btn.addEventListener('click', ()=>{
        var btnType = btn.classList[1];
        var num;
        var currentLowerText = displayLower.innerText;
        if(btnType != 'btnReciprocal' && btnType !='btnSqrt'){
            num = parseFloat(btn.textContent)
        }      
        if(!isNaN(num)){
            if(isOpClicked){
                displayLower.innerText = '';
                isOpClicked = !isOpClicked;
            }
            if(isEqualClicked){
                clear();
                displayLower.innerText = '';
                displayUpper.innerText = '';
                isEqualClicked = !isEqualClicked;
            }
            if(currentLowerText == '0'){
                displayLower.innerText = '';
            }
            threeNumClicks += 1;

            displayLower.innerText += num;
            // displayLower.innerText = comma(displayLower.innerText);
        }

        if(btnType === 'btnPercent'){
            if(operator != ''){
                var num1 = parseFloat(displayLower.innerText);
                nums[1] = num1 / 100;
                displayLower.innerText = nums[1];
            }
        }

        if(btnType === 'btnC'){
            clear();
        }

        if(btnType === 'btnCE'){
            displayLower.innerText = '0';
        }

        if(btnType === 'btnErase'){           
            if(isEqualClicked){
                displayUpper.innerText = '';
            }
            else{
                var tempText = displayLower.innerText;
                tempText = tempText.slice(0, tempText.length-1);
                displayLower.innerText = tempText;
                if(displayLower.innerText == ''){
                    displayLower.innerText = '0';
                }
            }
        }

        if(btnType === 'btnOp'){          
            nums[0] = parseFloat(displayLower.innerText);  
            isOpClicked = !isOpClicked;
            equalClicks = 0;
            isEqualClicked = false;
            operator = btn.textContent;
            displayUpper.innerText = nums[0] +' '+ btn.textContent;
        }

        if(btnType === 'btnEqual'){
            if(equalClicks > 0){
                nums[0] = parseFloat(displayLower.innerText);
            }
            else{
                nums[1] = parseFloat(displayLower.innerText);
            }
                    
            equalClicks += 1;                
            isEqualClicked = !isEqualClicked;
            displayUpper.innerText = '';
            
            if(operator === '+'){
                answer = Add(nums[0], nums[1]);
            }
            if(operator === '-'){
                answer = Subtract(nums[0], nums[1]);
            }
            if(operator === '*'){
                answer = Multiply(nums[0], nums[1]);
            }
            if(operator === '÷'){
                answer = Divide(nums[0], nums[1]);   
            }
            if(nums[0] === 0 && operator === ''){
                answer = nums[1];
            }

            displayUpper.innerText = EnterUpperText(nums[0], nums[1], operator);
            displayLower.innerText = answer;
            
            var tempHistoryNodes = histBody.childNodes;
            if(answer != 'Cannot divide by zero'){
                if(tempHistoryNodes[tempHistoryNodes.length-2] === histText){
                    histBody.removeChild(histText);
                }
                createHistoryItem(displayUpper.innerText, displayLower.innerText);
                
            }
        }

        if(btnType === 'btnReciprocal'){
            nums[1] = parseFloat(displayLower.innerText);
            answer = Reciprocal(nums[1]);
            displayUpper.innerText = '1 /('+nums[1]+')';
            displayLower.innerText = answer;
        }

        if(btnType === 'btnSquared'){
            nums[1] = parseFloat(displayLower.innerText);
            answer = Squared(nums[1]);
            displayUpper.innerHTML = nums[1]+'<sup>2</sup>';
            displayLower.innerText = answer;
        }

        if(btnType === 'btnSqrt'){
            nums[1] = parseFloat(displayLower.innerText);
            answer = SquareRoot(nums[1]);
            displayUpper.innerText = '√('+nums[1]+')';
            displayLower.innerText = answer;
        }

        if(btnType === 'btnPoint'){
            var text = displayLower.innerText;             
            if(!text.includes('.')){
                displayLower.innerText += '.';
            }               
        }
    })
})

function Add(num1, num2){
    if(num1 == 0){
        return num2;
    }
    return num1 + num2;
}

function Subtract(num1, num2){
    if(num1 == 0){
        return num2;
    }
    return num1 - num2;
}

function Multiply(num1, num2){
    if(num1 == 0){
        return num2;
    }
    return num1 * num2;
}

function Divide(num1, num2){
    if(num1 == 0){
        return num2;
    }
    if(num2 == 0){
        return 'Cannot divide by zero';
    }
    return parseFloat(num1) / parseFloat(num2);
}

function EnterUpperText(num1, num2, op){
    if(num1 == 0 && op == ''){
        return num2+' =';
    }
    
    return num1+' '+op+' '+num2+ ' =';   
}

function Reciprocal(num){
    return 1 / parseFloat(num);
}

function Squared(num){
    return Math.pow(parseInt(num), 2);
}

function SquareRoot(num){
    return Math.sqrt(parseFloat(num));
}

function clear(){
    nums[0] = 0;
    nums[1] = 0;
    operator = '';
    equalClicks = 0;
    displayLower.innerText = '0';
    displayUpper.innerText = '';
}



var histBottomMargin = document.createElement('div');
createHistoryMarginBottom();

//This function creates margin for bottom in history body
function createHistoryMarginBottom(){
    histBottomMargin = document.createElement('div');
    histBottomMargin.classList.add('hist-bottom-margin');
    histBody.appendChild(histBottomMargin);
}

    var newItem = document.createElement('div');  
    var newEq = document.createElement('div');
    var newAns = document.createElement('div'); 
//This function records your operation
function createHistoryItem(equation, answer){
    newItem = document.createElement('div');  
    newEq = document.createElement('div');
    newAns = document.createElement('div'); 

    newItem.classList.add('history-item');

    newEq.classList.add('hist-equation');
    newAns.classList.add('hist-ans');
    newEq.textContent = equation;
    newAns.textContent = answer;
    newItem.appendChild(newEq);
    newItem.appendChild(newAns);
    
    histBody.insertBefore(newItem, histBody.firstChild);
    historyItems = histBody.children;
}




// function comma(text){
//     // displayLower.innerText.
//     var formattedText = text.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
//     return formattedText;
// }