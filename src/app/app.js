require(['lodash'], function(_) { //jshint ignore:line
  'use strict';

  (function() {
    
    function Calculator() {
      var _self = this,
          displayLength = 13,
          operationFlag = false,
          equalsFlag = false,
          parenthesisFlag = false,
          percentageFlag = false,
          tempStr = null,
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
          '%': function(a, b, operation) {
            if (operation === '+') {
              return a + (b/a)*100;
            }

            if (operation === '×') {
              return a*b/100;
            }
          },
          '√': function(a, b) {
            return Math.pow(b, 1/a);
          }
        };

      function handleIntermediateOperation(btn) {
        var result;

        if (parenthesisFlag && typeof btn !== 'undefined') {
          if (btn.text === '+/-') {
            if (/-[0-9]+/.test(_self.intermediateStack[_self.intermediateStack.length - 1])) {
            _self.intermediateStack[_self.intermediateStack.length - 1] = Math.abs(_self.intermediateStack[_self.intermediateStack.length - 1]);  
            } else {
            _self.intermediateStack[_self.intermediateStack.length - 1] = '-' + parseFloat(_self.intermediateStack[_self.intermediateStack.length - 1]); 
            }
            return; 
          }

          if (operationFlag && _self.intermediateStack.length === 3) {
            result = calculate(_self.intermediateStack);
            _self.intermediateStack = [];
            _self.intermediateStack.push(result);
          }

          if (!operationFlag && !equalsFlag && !percentageFlag && _self.intermediateStack) {
            _self.intermediateStack[_self.intermediateStack.length - 1] = _self.intermediateStack[_self.intermediateStack.length - 1] + btn.text;
          } else {
            _self.intermediateStack.push(btn.text);
          }
        }
      }

      function handleOperation(btn) {
        var result;

        if (btn.text === '+/-') {
          if (/-[0-9]+/.test(_self.inputStack[_self.inputStack.length - 1])) {
            _self.inputStack[_self.inputStack.length - 1] = Math.abs(_self.inputStack[_self.inputStack.length - 1]);  
          } else {
          _self.inputStack[_self.inputStack.length - 1] = '-' + parseFloat(_self.inputStack[_self.inputStack.length - 1]); 
          }
          return;    
        }

        if (operationFlag && !equalsFlag && _self.inputStack.length) {
            if (_self.inputStack.length === 3) {
              result = calculate(_self.inputStack);
              _self.inputStack = [];
              _self.inputStack.push(result);
            }

           _self.inputStack.push(btn.text);
          return;
        } 

        if (!operationFlag && !equalsFlag && !_self.inputStack.length) {
          _self.inputStack.push(btn.text);
          return;
        }

        if (!operationFlag && !equalsFlag && !percentageFlag && _self.inputStack.length) {
          _self.inputStack[_self.inputStack.length - 1] = _self.inputStack[_self.inputStack.length - 1] + btn.text;
          return;
        }

        if (percentageFlag) {
          result = calculate(_self.inputStack);
          _self.displayText = result.toString().slice(0, displayLength);

          _self.inputStack = [];
          _self.inputStack.push(result);
        }

        if (equalsFlag) {
          if (!_self.inputStack.length) {
            return;
          }

          result = calculate(_self.inputStack);
          _self.displayText = result.toString().slice(0, displayLength);

          _self.inputStack = [];
          _self.inputStack.push(result);
        }
      }  

      function calculate(stack) {
        var a = +stack[0],
            op = stack[1],
            b = +stack[2];  

        if (!methods[op] || isNaN(a) || isNaN(b)) {
          return 'Error';
        }

        if (percentageFlag) {
          return methods['%'](+a, +b, op);
        }

        return methods[op](+a, +b);
      }

      function handleDisplayInput(btn) {
        var regEx = /[0-9]+/g,
            match,
            index;

        if (btn.text === '+/-' && !_self.displayText.length) {
          return;
        } else if (btn.text === '+/-') {
          match = _self.displayText.match(regEx);

          while ((match = regEx.exec(_self.displayText)) !== null) {
            index = match.index;
          }

          if (typeof index === 'undefined') {
            return;
          }

          if (/(-[0-9]+)/.test(_self.displayText)) {
            _self.displayText = tempStr || '' + Math.abs(_self.inputStack[_self.inputStack.length - 1]);
          } else {
            tempStr = _self.displayText.slice(0, index) ? _self.displayText.slice(0, index) : '';
            _self.displayText = tempStr + '(-' + parseFloat(_self.displayText.slice(index)) + ')';
          }
        } else {
          _self.displayText = _self.displayText + btn.text;
        }
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
          case '√':
            handleDisplayInput(btn);
            if (parenthesisFlag) {
              operationFlag = true;
              handleIntermediateOperation(btn);
            } else {
              this.intermediateStack = [];
              operationFlag = true;
              handleOperation(btn);
            }
            break;
          case '%':
            percentageFlag = true;
            handleDisplayInput(btn);
            handleOperation(btn);
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
            handleDisplayInput(btn);
            if (parenthesisFlag) {
              handleIntermediateOperation(btn);
            } else {
              handleOperation(btn);  
            }
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
            percentageFlag = false;
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
