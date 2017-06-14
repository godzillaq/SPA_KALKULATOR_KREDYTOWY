var calculationResultTable;
var comparisonResultTable;
var calculationSummaryTable;
var detailsChart;
var globalSchedule = [];
var globalCreditSummary = [];

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
    $scope.RateTime = "3M";
    $scope.installmentType = "FixedRate";
    $scope.Currency = "WIBOR";
    $scope.creditAmount = 123000;
    $scope.estateValue = 200000;
    $scope.creditTime = 360;
    $scope.btnPDFSHow = false;
$scope.commision = "1";
$scope.spread = "2";
    $scope.getPercentage = function (a) {
      return a;
    }

    OdczytajParametry();
    $scope.CompareCreditOffers = function () {
      var comparedCredits = CompareCreditOffers($scope.creditAmount, $scope.estateValue, $scope.creditTime);
      drawComparisonResultTable(comparedCredits);
    }


    $scope.calculateInstallment = function () {
      var interestRate;
      $scope.btnPDFSHow = false;
      if ($scope.showAutomateRatioParameters === "InterestRateYes") {
        interestRate = GetInterestRateFromApi($scope.RateTime, $scope.Currency);
      }
      else {
        interestRate = $scope.InterestRate;
      }
      var schedule;
      if ($scope.installmentType === "FixedRate") {
        schedule = calculateFixedInstallmentSchedule(parseFloat($scope.creditAmount), (parseFloat($scope.spread) + parseFloat(interestRate)) / 100, $scope.creditTime);
        scheduleWithPLN = AddPLNToEachCell(schedule);
        
        drawCalculationResultTable(scheduleWithPLN);
      }
      else if ($scope.installmentType === "VariableRate") {
        schedule = calculateVariableInstallmentSchedule(parseFloat($scope.creditAmount), (parseFloat($scope.spread) + parseFloat(interestRate)) / 100, $scope.creditTime);
        scheduleWithPLN = AddPLNToEachCell(schedule);

        drawCalculationResultTable(scheduleWithPLN);
      }
      var interestsInTime = GetInterestsInTime(schedule);
      var capitalInTime = GetCapitalInTime(schedule);
      var remainingCapitalInTime = GetRemainingCapitalInTime(schedule);
      var installmentsInTime = GetInstallmentsInTime(schedule);

      var labels = GenerateLablesForChart(remainingCapitalInTime);
      DrawInstallmentDetailsChart(interestsInTime, capitalInTime, installmentsInTime, remainingCapitalInTime, labels);
      DrawRemainingCapitalInTimeChart(remainingCapitalInTime, labels);
      var creditSummary = GetCreditSummary($scope.creditAmount, schedule, $scope.commision, $scope.spread, interestRate, $scope.estateValue);
      drawCalculationSummaryTable(creditSummary);
      globalSchedule = schedule;
      globalCreditSummary = creditSummary;
      $scope.btnPDFSHow = true;
    };

    $scope.PrintToPdf = function () {
      PrintPDF();
    }
    $scope.DBLogowanie = function () {
      Zaloguj();
    }
    $scope.SaveParameters = function () {
      if (Identyfikator_uzytkownik == -1) ZapiszParametryDoLS();
      else DBZapiszParametryKW();
    }
  });
  $('.nav-tabs a[href="#orange"]').tab('show');
})();//<-- here

function AddPLNToEachCell(array){
  var resultArray = [];

  array.forEach(function(x){
    resultArray.push({
      0: x[0],
      1: x[1] + " PLN",
    2: x[2] + " PLN",
    3: x[3] + " PLN",
    4: x[4] + " PLN"
    });
  });
  return resultArray;
}

function GetInstallmentsInTime(schedule) {
  var installmentsInTime = [];
  schedule.forEach(function (element) {
    installmentsInTime.push(element[1]);
  }, this);
  return installmentsInTime;
}

function GetInterestsInTime(schedule) {
  var interestsInTime = [];
  schedule.forEach(function (element) {
    interestsInTime.push(element[3]);
  }, this);
  return interestsInTime;
}

function GetCapitalInTime(schedule) {
  var interestsInTime = [];
  schedule.forEach(function (element) {
    interestsInTime.push(element[2]);
  }, this);
  return interestsInTime;
}

function GetRemainingCapitalInTime(schedule) {
  var remainingCapitalInTime = [];
  schedule.forEach(function (element) {
    remainingCapitalInTime.push(element[4]);
  }, this);
  return remainingCapitalInTime;
}

function GenerateLablesForChart(arrayInTime) {
  var labels = [];
  for (var i = 1; i <= arrayInTime.length; i++) {
    labels.push(i.toString());
  }
  return labels;
}

function DrawInstallmentDetailsChart(interestsInTime, capitalInTime, installmentsInTime, remainingCapitalInTime, labels) {
  var ctx = document.getElementById('installmentDetailsChart').getContext('2d');
  if (detailsChart != undefined) {
    detailsChart.destroy();
  }

  detailsChart = new Chart(ctx, {
    type: 'line',
    data: {

      labels: labels,
      datasets: [{
        label: 'Odsetki',
        data: interestsInTime,
        yAxisID: "y-axis-0",
        backgroundColor: "rgba(153,255,51,0.4)"
      }, {
        label: 'Kapitał',
        data: capitalInTime,
        yAxisID: "y-axis-0",
        backgroundColor: "rgba(255,153,0,0.4)"
      }, {
        label: 'Rata',
        data: installmentsInTime,
        yAxisID: "y-axis-0",
        backgroundColor: "rgba(55,153,0,0.4)"
      }, {
        label: 'Kapitał do spłaty',
        data: remainingCapitalInTime,
        yAxisID: "y-axis-1",
        backgroundColor: "rgba(240,53,55,0.4)"
      }]
    },
    options: {
      responsive: true,

      maintainAspectRatio: true,
      scales: {
        yAxes: [{
          position: "left",
          "id": "y-axis-0",
          fontSize: 50
        }, {
          position: "right",
          "id": "y-axis-1"
        }]
      }
    }
  });
}

function DrawRemainingCapitalInTimeChart(remainingCapitalInTime, labels) {
  var ctx = document.getElementById('remainingCapitalInTimeChart').getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Kapitał do spłaty',
        data: remainingCapitalInTime,
        backgroundColor: "rgba(55,153,0,0.4)"
      }],
    },
    xAxes: [{
      display: false
    }]
  });
}

function GetCreditSummary(amount, schedule, commissionPercent, spread, interestRate, estateValue) {
  var result = [];
  var sumInterestsToPay = 0;
  var creditAmount = parseFloat(amount);
  var commisionToPay = Math.round(parseFloat(amount) * ((parseFloat(commissionPercent) / 100) * 100)) / 100;
  var creditRate = parseFloat(spread) + parseFloat(interestRate);
  var ltv = Math.round((parseFloat(amount) / parseFloat(estateValue) * 1000)) / 10;
  schedule.forEach(function (element) {
    sumToPay += element[1];
    sumInterestsToPay += element[3];
  });
  var sumToPay = Math.round((creditAmount + sumInterestsToPay + commisionToPay) * 100) / 100;

  result.push({
    0: creditAmount + " PLN",
    1: sumToPay + " PLN",
    2: Math.round(sumInterestsToPay * 100) / 100 + " PLN",
    3: commisionToPay + " PLN",
    4: creditRate + "%",
    5: ltv + "%"
  });

  return result;
}

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

function GetObjectFromArrayMeetCondition(array, rateTime, currency) {
  var result;
  array.filter(function (obj) {
    if (obj.rateName == currency + " " + rateTime) {
      result = obj;
    }
  });

  return result;
}

function GetCorrectUrl(currency) {
  if (currency === "WIBOR") {
    return "http://localhost/api/rates.php";
  }
  else if (currency === "LIBOR") {
    return "http://localhost/api/rateschf.php";
  }
  else if (currency === "EURIBOR") {
    return "http://localhost/api/rateseur.php";
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
      1: Math.round((capital + interests) * 100) / 100 ,
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

  for (var i = 1; i <= months; i++) {
    var previousAmount = i === 1 ? amount : installmentsDetails[i - 2][4];
    var remainingAmount = i === 1 ? amount + ExcelFormulas.PPMT(rate / 12, i, months, amount, 0, 0) : installmentsDetails[i - 2][4] + ExcelFormulas.PPMT(rate / 12, i, months, amount, 0, 0);
    installmentsDetails.push({
      0: i,
      1: Math.round(installment * 100) / 100 ,
      2: i === months ? Math.round(previousAmount * 100) / 100 : Math.round(-ExcelFormulas.PPMT(rate / 12, i, months, amount, 0, 0) * 100) / 100,
      3: Math.round(-(-installment - ExcelFormulas.PPMT(rate / 12, i, months, amount, 0, 0)) * 100) / 100,
      4: i === months ? 0 : Math.round(remainingAmount * 100) / 100,
    });
  }

  return installmentsDetails;
}

function drawComparisonResultTable(tableData) {
  if (comparisonResultTable !== undefined) {
    comparisonResultTable.destroy();
  }

  comparisonResultTable = $('#comparisonResult').DataTable({
    data: tableData,
    columns: [
      { title: "Lp." },
      { title: "Bank" },
      { title: "Rata" },
      { title: "Całkowita kwota do spłaty" }
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

function drawCalculationResultTable(tableData) {
  if (calculationResultTable !== undefined) {
    calculationResultTable.destroy();
  }

  calculationResultTable = $('#calculationResult').DataTable({
    data: tableData,
    columns: [
      { title: "" },
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

function drawCalculationSummaryTable(tableData) {
  if (calculationSummaryTable !== undefined) {
    calculationSummaryTable.destroy();
  }

  calculationSummaryTable = $('#calculationSummary').DataTable({
    data: tableData,
    "bPaginate": false,
    columns: [
      { title: "Kwota kredytu" },
      { title: "Całkowita kwota do spłaty" },
      { title: "Koszt odsetek" },
      { title: "Koszt prowizji" },
      { title: "Oprocentowanie" },
      { title: "LTV" }
    ],
    "info": false,
    responsive: true,
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

function OdczytajParametry() {
  if (localStorage.getItem("email") != null && localStorage.getItem("haslo") != null && localStorage.email != '' && localStorage.haslo != '') {
    $("#lemail").val(localStorage.email);
    $("#lhaslo").val(localStorage.haslo);
    Zaloguj(localStorage.email, localStorage.haslo);
  }

  if (Identyfikator_uzytkownik == -1) OdczytajZLS();
  else DBOdczytajParametryKW();
}


function CompareCreditOffers(creditAmount, estateValue, months) {
  var offers = GetCreditOffersFromAPI();
  var ltv = parseFloat(creditAmount) / parseFloat(estateValue);
  if (ltv > 0.9) {
    $("#toHighLtvAlert").fadeTo(5000, 500).slideUp(500, function () {
      $(".alert").slideUp(500);
    });
  }
  var bankOffers;
  if (ltv <= 0.90 && ltv >= 0.80) {
    offers.filter(function (obj) {
      if (obj.Nazwa === "LTV90NK") {
        bankOffers = obj;
      }
    });
  }
  else if (ltv <= 0.80) {
    offers.filter(function (obj) {
      if (obj.Nazwa === "LTV80NK") {
        bankOffers = obj;
      }
    });
  }
  
  var finalResults = [];
  bankOffers.Dane.forEach(function(x) {
    
    var interestRate = GetInterestRateFromApi("3M", "WIBOR");
    var spread = x.Marza.replace('%', '').replace(',' ,'.');
    var schedule = calculateFixedInstallmentSchedule(creditAmount, Math.round((interestRate + parseFloat(spread))*100)/100/100, months);
    var summary = GetCreditSummary(creditAmount, schedule, 0, parseFloat(spread), interestRate, estateValue);
    finalResults.push({1: x.Bank.trim().replace(/\*/g, ''), 2: schedule[0][1], 3: summary[0][1]});

    
});
var sortedResults = SortResults(finalResults);
var lp = 1;
sortedResults.forEach(function(x){
  x[0] = lp;
  lp++;
});
   return sortedResults;
}

function SortResults(array){
  return array.sort(function(a, b) {
    return parseFloat(a[2]) - parseFloat(b[2]);
  });
}

function GetCreditOffersFromAPI() {
  var response;
  var currencyJson = $.ajax({
    url: "http://localhost/spa/api/bankierKH.php",
    context: document.body,
    async: false
  }).done(function (x) {
    response = JSON.parse(x);
  });
  return response;
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