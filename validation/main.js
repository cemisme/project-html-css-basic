Validator = function (options) {
    function getParent(element, selector) {
      while(element.parentElement)
      {
         if( element.parentElement.matches(selector))
         {
          return element.parentElement
         }
         element=element.parentElement;
      }
  
    }
    var selectorRules = [];
    function validate(inputElement, rule) {
      var rules = selectorRules[rule.selector];
      var errorMessage;
      var errorElement = getParent(inputElement, options.selector).querySelector(
        ".form-message"
      );
      for (var i = 0; i < rules.length; i++) {
        errorMessage = rules[i](inputElement.value);
        if (errorMessage) break;
      }
  
      if (errorMessage) {
        errorElement.innerText = errorMessage;
        getParent(inputElement, options.selector).classList.add("invalid");
      } else {
        errorElement.innerText = "";
        getParent(inputElement, options.selector).classList.remove("invalid");
      }
      inputElement.onclick = function () {
        errorElement.innerText = "";
        getParent(inputElement, options.selector).classList.remove("invalid");
      };
      return !errorMessage;
    }
    var formElement = document.querySelector(options.form);
    if (formElement) {
      formElement.onsubmit = function (e) {
        e.preventDefault(); // đưa submit về dạng default
        options.rules.forEach(function (rule) {
          var inputElement = formElement.querySelector(rule.selector);
          validate(inputElement, rule);
          var isCheck = validate(inputElement, rule);
          if (isCheck) {
            var enableInput = formElement.querySelectorAll("[name]");
            var valuesHave = Array.from(enableInput).reduce(function (
              values,
              index
            ) {
              values[index.name] = index.value;
              return values;
            },
            {});
            options.onSubmit(valuesHave);
          } else {
            console.log("có lỗi");
          }
        });
      };
      options.rules.forEach(function (rule) {
        var inputElement = formElement.querySelector(rule.selector);
  
        if (inputElement) {
          inputElement.onblur = function () {
            validate(inputElement, rule);
          };
        }
        if (Array.isArray(selectorRules[rule.selector])) {
          selectorRules[rule.selector].push(rule.test);
        } else {
          selectorRules[rule.selector] = [rule.test];
        }
        
      });
    }
  };
  Validator.isRequired = function (selector) {
    return {
      selector: selector,
      test: function (value) {
        return value.trim() ? undefined : "Vui lòng nhập trường này.";
      },
    };
  };
  Validator.isEmail = function (selector) {
    return {
      selector: selector,
      test: function (value) {
        var regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
        return regex.test(value) ? undefined : "Trường này phải là Email.";
      },
    };
  };
  Validator.minLength = function (selector, min) {
    return {
      selector: selector,
      test: function (value) {
        return value.length >= min ? undefined : "Vui lòng nhập hơn 6 ký tự.";
      },
    };
  };
  Validator.isConfirmed = function (selector, isPw) {
    return {
      selector: selector,
      test: function (value) {
        if (value !=null &&isPw() =="") {
          return "Vui lòng nhập mật khẩu trước.";
        } else if (value === isPw()) {
          return undefined;
        } else
        {return "Vui lòng nhập lại trùng với mật khẩu";}
      },
    };
  };
  