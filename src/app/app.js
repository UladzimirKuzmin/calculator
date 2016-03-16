require(['lodash'], function(_) { //jshint ignore:line
  'use strict';

  (function() {
    
    function Calculator() {
      var ctrl = this, 
          handleOperationPress,
          calculate,
          displayLength = 13,
          opFlag = false,
          eqFlag = false,
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

      this.displayText = '';
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
        var btn = this.buttons[i];
        
        switch(btn.text) {
          case '+':
          case '-':
          case '×':
          case '÷':
          case '%':
          case '√':
          case '=':
            handleOperationPress(btn);
            break;
          default: 
            this.displayText = (opFlag || eqFlag ? btn.text : this.displayText + btn.text).slice(0, displayLength);
            opFlag = false;
            eqFlag = false;
         }

         this.updateDisplay();
      };

      handleOperationPress = function(btn) {
        var result;
        
        if (!opFlag && ctrl.displayText.length > 0) {
          ctrl.inputStack.push(parseFloat(ctrl.displayText));
          
          if (ctrl.inputStack.length > 1) {
            result = parseFloat(calculate().toString().slice(0, displayLength)); 
            ctrl.inputStack = btn.text === '=' ? [] : [result];
            ctrl.displayText = result.toString();
          }
          
          if (!opFlag && btn.text !== '=') {
            ctrl.inputStack.push(btn.text);
            opFlag = true;
          }
          
          eqFlag = (btn.class === 'equals');
        }
      };

      calculate = function() {
        var a = +ctrl.inputStack[0],
            op = ctrl.inputStack[1],
            b = +ctrl.inputStack[2];  

        if (!methods[op] || isNaN(a) || isNaN(b)) {
          return NaN;
        }

        return methods[op](+a, +b);
      };

      this.render = function() {
        var self = this,
            keyboard = document.querySelector('.calculator-keyboard'),
            templateView = document.querySelector('.calculator-template'),
            template = _.template(templateView.innerHTML);

        keyboard.innerHTML = template({buttons: self.buttons});  
      };

      this.updateDisplay = function(value) {
        var displayInput = document.querySelector('.calculator-display__input');

        displayInput.innerHTML = this.displayText;
      };

      this.clearDisplay = function(value) {
        var displayInput = document.querySelector('.calculator-display__input');

        this.inputStack = [];
        this.displayText = '';
        opFlag = false;
        eqFlag = false;    

        displayInput.innerHTML = this.displayText;
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
