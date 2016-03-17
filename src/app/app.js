require(['lodash'], function(_) { //jshint ignore:line
  'use strict';

  (function() {
    
    function Calculator() {
      var _self = this,
          lastSymbol,
          displayLength = 13,
          operationFlag = false,
          equalsFlag = false,
          parenthesisFlag = false,
          methods = {
          '+': function(a, b) {
            return a + b;
          },
          '-': function(a, b) {
            return a - b;
          },
          '×': function(a, b) {
            return a * b;
          },
          '÷': function(a, b) {
            return a / b;
          },
          '%': function(a, b) {
            return a % b;
          },
          '√': function(a, b) {
            return Math.pow(b, 1/a);
          }
        };

      function handleIntermediateOperation(btn) {
        if (parenthesisFlag && typeof btn !== 'undefined') {
          _self.intermediateStack.push(btn.text);
        }
      }

      function handleOperation(btn) {
        var result;

        if (operationFlag && !equalsFlag && _self.inputStack.length) {
          _self.inputStack.push(btn.text);
          return;
        } 

        if (!operationFlag && !equalsFlag && !_self.inputStack.length) {
          _self.inputStack.push(btn.text);
          return;
        }

        if (!operationFlag && !equalsFlag && _self.inputStack.length) {
          _self.inputStack[_self.inputStack.length - 1] = _self.inputStack[_self.inputStack.length - 1] + btn.text;
          return;
        }

        if (equalsFlag) {
          result = calculate(_self.inputStack);
          _self.displayText = result.toString();

          _self.inputStack = [];
          _self.inputStack.push(result);

          equalsFlag = false;
        }
      }  

      function calculate(stack) {
        var a = +stack[0],
            op = stack[1],
            b = +stack[2];  

        if (!methods[op] || isNaN(a) || isNaN(b)) {
          return 'Error';
        }

        return methods[op](+a, +b);
      }

      function handleDisplayInput(btn) {
        if (btn.class === 'operation' && lastSymbol.class === 'operation' && btn.text !== '(' && btn.text !== ')') {
          _self.displayText = _self.displayText.slice(0, -1);
          _self.displayText = (_self.displayText + btn.text).slice(0, displayLength);
        } else {
          _self.displayText = (_self.displayText + btn.text).slice(0, displayLength);
        }
 
        lastSymbol = btn;  
      }

      this.displayText = '';
      this.intermediateStack = [];
      this.inputStack = [];

      this.buttons = [
        {text: '1', value: 1, class: 'number'},
        {text: '2', value: 2, class: 'number'},
        {text: '3', value: 3, class: 'number'},
        {text: '4', value: 4, class: 'number'},
        {text: '5', value: 5, class: 'number'},
        {text: '6', value: 6, class: 'number'},
        {text: '7', value: 7, class: 'number'},
        {text: '8', value: 8, class: 'number'},
        {text: '=', class: 'equals'},
        {text: '9', value: 9, class: 'number'},
        {text: '0', value: 0, class: 'number'},
        {text: '±', class: 'switcher'},
        {text: '+', class: 'operation'},
        {text: '-', class: 'operation'},
        {text: '×', class: 'operation'},
        {text: '÷', class: 'operation'},
        {text: '(', class: 'operation'},
        {text: ')', class: 'operation'},
        {text: '%', class: 'operation'},
        {text: '√', class: 'operation'},
        {text: '=', class: 'equals'},
        {text: '.', class: 'number'},
        {text: '+/-', class: 'operation'},
        {text: '123', class: 'switcher'}
      ];

      this.press = function(i) {
        var btn = _self.buttons[i];
        
        switch(btn.text) {
          case '+':
          case '-':
          case '×':
          case '÷':
          case '%':
          case '√':
            handleDisplayInput(btn);

            if (parenthesisFlag) {
              handleIntermediateOperation(btn);
            } else {
              this.intermediateStack = [];
              operationFlag = true;
              handleOperation(btn);
            }

            break;
          case '(':
            parenthesisFlag = true;
            handleDisplayInput(btn);
            handleIntermediateOperation();
            break;
          case ')':
            handleDisplayInput(btn);
            handleIntermediateOperation();
            _self.inputStack.push(calculate(_self.intermediateStack));
            parenthesisFlag = false;
            break;
          case '=':
            equalsFlag = true;
            handleOperation(btn);
            break;
          case '+/-':
            break;
          default: 
            if (parenthesisFlag) {
              handleDisplayInput(btn);
              handleIntermediateOperation(btn);
            } else {
              handleDisplayInput(btn);
              handleOperation(btn);
            }

            operationFlag = false;
            equalsFlag = false;
         }

         _self.updateDisplay();
      };

      this.render = function() {
        var keyboard = document.querySelector('.calculator-keyboard'),
            templateView = document.querySelector('.calculator-template'),
            template = _.template(templateView.innerHTML);

        keyboard.innerHTML = template({buttons: _self.buttons});  
      };

      this.updateDisplay = function(value) {
        var displayInput = document.querySelector('.calculator-display__input');

        displayInput.innerHTML = _self.displayText;
      };

      this.clearDisplay = function(value) {
        var displayInput = document.querySelector('.calculator-display__input');

        _self.inputStack = [];
        _self.intermediateStack = [];
        _self.displayText = '';
        operationFlag = false;
        equalsFlag = false; 
        parenthesisFlag = false;   

        displayInput.innerHTML = _self.displayText;
      };
    }


    //Create calculator instance and manage clicks
    var calculator = new Calculator(),
        keyboard,
        buttons,
        clearBtn;
        
    //render calcultor
    calculator.render();

    //get dom elements
    keyboard = document.querySelector('.calculator-keyboard');
    buttons = document.querySelectorAll('.button');
    clearBtn = document.querySelector('.clear');

    //add event listeners
    _.each(buttons, function(button) {
      if (button.classList.contains('switcher')) {
        button.addEventListener('click', function() {
          keyboard.classList.toggle('switched-to-operations');
        }, false);
      } else {
        button.addEventListener('click', function() {
          calculator.press(+button.value);
        }, false);
      }
    });

    clearBtn.addEventListener('click', function() {
      calculator.clearDisplay();
    });

  })();

});
