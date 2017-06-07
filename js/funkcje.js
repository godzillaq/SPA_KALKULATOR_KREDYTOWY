var table;

(function () {
  var app = angular.module('myApp', []);

  app.controller('myCtrl', function () {
    $scope = angular.element('[ng-controller=myCtrl]').scope();
    $scope.creditOptions = {};
    $scope.creditOptions.availableMonthsSelect = { "selected": [] };
    var min = 12;
    var max = 360;
    $scope.creditOptions.availableMonths = [];
    for (var i = min; i <= max; i++) {
      var opt = document.createElement('option');
      opt.value = i.toString();
      opt.innerHTML = i.toString();
      $scope.creditOptions.availableMonths.push({ id: i, value: i.toString() })
    };

    $scope.showAutomateRatioParameters = "InterestRateYes";
    $scope.Currency = "PLN";
    $scope.RateTime = "RateTime3M";

    $scope.calculateInstallment = function () {
      var interestRate;
      if ($scope.showAutomateRatioParameters === "InterestRateYes") {
        interestRate = GetInterestRateFromApi($scope.RateTime, $scope.Currency);
      }
      else {
        interestRate = $scope.InterestRate;
      }
      if ($scope.installmentType === "FixedRate") {
        var schedule = calculateFixedInstallmentSchedule(parseFloat($scope.creditAmount), (parseFloat($scope.spread) + parseFloat(interestRate)) / 100, $scope.creditTime);
        drawTable(schedule);
      }
      else if ($scope.installmentType === "VariableRate") {
        var schedule = calculateVariableInstallmentSchedule(parseFloat($scope.creditAmount), (parseFloat($scope.spread) + parseFloat(interestRate)) / 100, $scope.creditTime);
        drawTable(schedule);
      }
    };


  });
})();//<-- here

function GetInterestRateFromApi(rateTime, currency) {
  var rateUrl = GetCorrectUrl(currency);
  var response;

  var currencyJson = $.ajax({
    url: rateUrl,
    context: document.body,
    async: false 
  }).done(function (x) {
    response = JSON.parse(x);
    
  });
  var a = GetObjectFromArrayMeetCondition(response, rateTime, currency);
  return parseFloat(a.value.replace(/ *\([^)]*\) */g, "").replace(/,/, "."));
}

function GetObjectFromArrayMeetCondition(array, rateTime, currency){
  var result;
  array.filter(function (obj) {
    if (obj.rateName ==  currency + " " + rateTime){
      result = obj;
    }
  });

  return result;
}

function GetCorrectUrl(currency) {
  if (currency === "WIBOR") {
    return "http://localhost/rates.php";
  }
  else if (currency === "LIBOR") {
    return "http://localhost/rateschf.php";
  }
  else if (currency === "EURIBOR") {
    return "http://localhost/rateseur.php";
  }
}


function calculateVariableInstallmentSchedule(amount, rate, months) {
  var installmentsDetails = [];
  ; var previousRemainingAmount = amount;
  for (var i = 1; i <= months; i++) {
    var capital = i === months ? previousRemainingAmount : Math.round(amount / months * 100) / 100;

    var remainingAmount = i === 1 ? amount - capital : installmentsDetails[i - 2][4] - capital;
    var interests = rate / 12 * previousRemainingAmount;


    installmentsDetails.push({
      0: i,
      1: Math.round((capital + interests) * 100) / 100,
      2: Math.round(capital * 100) / 100,
      3: Math.round(interests * 100) / 100,
      4: Math.round(remainingAmount * 100) / 100,
    });
    previousRemainingAmount = Math.round(remainingAmount * 100) / 100;
  }

  return installmentsDetails;
}

function calculateFixedInstallmentSchedule(amount, rate, months) {
  var installmentsDetails = [];
  var installment = -ExcelFormulas.PMT(rate / 12, months, amount);

  // for (var i = 1; i <= months; i++) {
  //   installmentsDetails.push({ 
  //     installmentNumber: i, 
  //     installmentSum: installment, 
  //     capital: -ExcelFormulas.PPMT(rate/12, i, months, amount, 0, 0), 
  //     interests: -(-installment - ExcelFormulas.PPMT(rate/12, i, months, amount, 0, 0)),
  //     remainingAmount: i === 1 ? amount + ExcelFormulas.PPMT(rate/12, i, months, amount, 0, 0) : installmentsDetails[i-2].remainingAmount + ExcelFormulas.PPMT(rate/12, i, months, amount, 0, 0)  });
  // }

  for (var i = 1; i <= months; i++) {
    var previousAmount = i === 1 ? amount : installmentsDetails[i - 2][4];
    var remainingAmount = i === 1 ? amount + ExcelFormulas.PPMT(rate / 12, i, months, amount, 0, 0) : installmentsDetails[i - 2][4] + ExcelFormulas.PPMT(rate / 12, i, months, amount, 0, 0);
    installmentsDetails.push({
      0: i,
      1: Math.round(installment * 100) / 100,
      2: i === months ? Math.round(previousAmount * 100) / 100 : Math.round(-ExcelFormulas.PPMT(rate / 12, i, months, amount, 0, 0) * 100) / 100,
      3: Math.round(-(-installment - ExcelFormulas.PPMT(rate / 12, i, months, amount, 0, 0)) * 100) / 100,
      4: i === months ? 0 : Math.round(remainingAmount * 100) / 100,
    });
  }

  return installmentsDetails;
}

function drawTable(tableData) {
  if (table !== undefined) {
    table.destroy();
  }

  table = $('#calculationResult').DataTable({
    data: tableData,
    columns: [
      { title: "Nr raty" },
      { title: "Rata" },
      { title: "Kapitał" },
      { title: "Odsetki" },
      { title: "Kwota pozostała do spłaty" }
    ],
    "language": {
      "lengthMenu": "Wyświetl _MENU_ rekordów na stronę",
      "zeroRecords": "Nic nie znaleziono",
      "info": "Pokazywanie strony _PAGE_ z _PAGES_",
      "infoEmpty": "Brak rekordów",
      "infoFiltered": "(filtered from _MAX_ total records)",
      "search": "Szukaj"
    },
    searching: false,
    "columnDefs": [
      { "className": "dt-center", "targets": "_all" }
    ]
  });
}




$(document).ready(function () {
  generateOptions();
  // Add smooth scrolling to all links in navbar + footer link
  $(".navbar a, footer a[href='#myPage']").on('click', function (event) {
    // Make sure this.hash has a value before overriding default behavior
    if (this.hash !== "") {
      // Prevent default anchor click behavior
      event.preventDefault();

      // Store hash
      var hash = this.hash;

      // Using jQuery's animate() method to add smooth page scroll
      // The optional number (900) specifies the number of milliseconds it takes to scroll to the specified area
      $('html, body').animate({
        scrollTop: $(hash).offset().top
      }, 900, function () {

        // Add hash (#) to URL when done scrolling (default click behavior)
        window.location.hash = hash;
      });
    } // End if
  });

  $(window).scroll(function () {
    $(".slideanim").each(function () {
      var pos = $(this).offset().top;

      var winTop = $(window).scrollTop();
      if (pos < winTop + 600) {
        $(this).addClass("slide");
      }
    });
  });
})