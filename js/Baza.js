var Identyfikator_uzytkownik = -1;
var Nazwa_uzytkownik = "";


function Zaloguj(email_ = '', haslo_ = '', odczytajParametry = true)
{
	var email = $("#lemail").val();
	var haslo = $("#lhaslo").val();
	
	if (email_ != "" && haslo_ != "") 
	{
		email = email_;
		haslo = haslo_;
	}
	
	$.post("baza.php",{ operacja_: "logowanie", email_: email, haslo_:haslo},
	function(data) 
	{
		if (data < 0) alert("Niepoprawne dane!");
		else
		{
			var uz_dane = JSON.parse(data);
			Identyfikator_uzytkownik = uz_dane.Id;
			Nazwa_uzytkownik = uz_dane.Nazwa;
			$("#myModal").modal("hide");
			$("#btnLoginReje").hide();	
			$("#Uz_Nazwa").text("Witaj " + Nazwa_uzytkownik + " !"); 
			if ($('#lzapamietajdane').is(':checked'))
			{			
				ZapiszDoLS(email, haslo);
			}
			//if (odczytajParametry) OdczytajParametry();
			DBOdczytajParametryKW();
		}
	});
};		  


function Zarejestruj()
{
	
	var nazwa = $("#rnazwa").val();
	var email = $("#remail").val();
	var haslo = $("#rhaslo").val();
	
	if (nazwa == "" || email == "" || haslo == "")
	{
		alert("Trzeba by dorobić jakąś fajną walidację tego ;)");
		return;
	}	
	$.post("baza.php",{ operacja_: "rejestracja", nazwa_: nazwa, email_: email, haslo_:haslo},
	function(data) 
	{
		if (data < 0) alert("Adres email jest już zajęty!");
		else
		{
			var uz_dane = JSON.parse(data);
			Identyfikator_uzytkownik = uz_dane.Id;
			Nazwa_uzytkownik = uz_dane.Nazwa;
			$("#myModal").modal("hide");
			$("#btnLoginReje").hide();	
			$("#Uz_Nazwa").text("Witaj " + Nazwa_uzytkownik + " !");
			if ($('#rzapamietajdane').is(':checked'))
			{			
				ZapiszDoLS(email, haslo);
			}	
		}
	});
};


function ZapiszDoLS(email, haslo)
{
	localStorage.email = email; 
	localStorage.haslo = haslo;
}
function OdczytajZLS()
{	
	if (localStorage.getItem("KwotaKredytu") == null) return;
	$scope.creditAmount = localStorage.KwotaKredytu;
	$scope.estateValue = localStorage.WartoscNieruchomosci;
	$scope.creditTime = localStorage.CzasKredytowaniaWMiesiacach;
	$scope.spread = localStorage.Marza;
	$scope.commision = localStorage.Prowizja;
	$scope.installmentType = localStorage.RodzajRat; 
	$scope.showAutomateRatioParameters = localStorage.AutoPobieraniStopProc;
	$scope.Currency = localStorage.WalutaKredytu;
	$scope.RateTime = localStorage.OkresCzasowyStopProc;
	$scope.InterestRate = localStorage.WartoscStopProc;	
	//$scope.$apply();
}

function ZapiszParametryDoLS()
{
	localStorage.KwotaKredytu = $scope.creditAmount;
	localStorage.WartoscNieruchomosci = $scope.estateValue;
	localStorage.CzasKredytowaniaWMiesiacach = $scope.creditTime;
	localStorage.Marza = $scope.spread;
	localStorage.Prowizja = $scope.commision;
	localStorage.RodzajRat = $scope.installmentType; 
	localStorage.AutoPobieraniStopProc = $scope.showAutomateRatioParameters;
	localStorage.WalutaKredytu = $scope.Currency;
	localStorage.OkresCzasowyStopProc = $scope.RateTime;
	localStorage.WartoscStopProc = $scope.InterestRate;
}

function DBZapiszParametryKW()
{
	var param = new Object();

	param.userId = Identyfikator_uzytkownik;
	param.KwotaKredytu = $scope.creditAmount;
	param.WartoscNieruchomosci = $scope.estateValue;
	param.CzasKredytowaniaWMiesiacach = $scope.creditTime;
	param.Marza = $scope.spread;
	param.Prowizja = $scope.commision;
	param.RodzajRat = $scope.installmentType; 
	param.AutoPobieraniStopProc = $scope.showAutomateRatioParameters;
	
	if ($('#InterestRateYes').is(':checked'))
	{
		param.WalutaKredytu = $scope.Currency;
		param.OkresCzasowyStopProc = $scope.RateTime;
		param.WartoscStopProc = 'NULL';
	}
	else
	{
		param.WalutaKredytu = 'NULL';
		param.OkresCzasowyStopProc = 'NULL';
		param.WartoscStopProc = $scope.InterestRate;
	}	
	param.TypDanych = TypDanych; 
	var paramJSON = JSON.stringify(param);  	
	
	$.post("baza.php",{ operacja_: "SetParamsKW", paramKW_: paramJSON},
	function(data) 
	{
		//alert(data);
	});
	
}

function DBOdczytajParametryKW()
{
	$.post("baza.php",{ operacja_: "GetParamsKW", userId_: Identyfikator_uzytkownik},
	function(data) 
	{
		if (data < 0) return;
		else
		{
			var param = JSON.parse(data);
			$scope.creditAmount = param.KwotaKredytu;
			$scope.estateValue = param.WartoscNieruchomosci;
			$scope.creditTime = param.CzasKredytowaniaWMiesiacach;
			$scope.spread = param.Marza;
			$scope.commision = param.Prowizja;
			$scope.installmentType = param.RodzajRat;
			$scope.showAutomateRatioParameters = param.AutoPobieraniStopProc;
			$scope.Currency = param.WalutaKredytu;
			$scope.RateTime = param.OkresCzasowyStopProc;
			$scope.InterestRate = param.WartoscStopProc;
			
			if (param.TypDanych == "0")
			{
				$('a[href="#calculationTab"]').click();
				$scope.calculateInstallment();
			}
			else
			{
				$('a[href="#comparisonTab"]').click();
				$scope.CompareCreditOffers();
			}
			
			$scope.$apply();
		}
	});	
}

