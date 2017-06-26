function PrintPDF(typDanych)
{
	// 0 = Kalkulacja wg własnych danych
	// 1 = Porównywanie kredytów
	//
	var str;
	//
	var doc = new jsPDF('p', 'pt');
	doc.text("Kalkulator kredytowy - kalkulacja",150,70);
	//
	var d = new Date();
	var month = d.getMonth()+1;
	var day = d.getDate();
	var dataCzas = d.getFullYear() + '/' + (month < 10 ? '0' : '') + month + '/' + (day < 10 ? '0' : '') + day + " " + d.getHours() + ': '+ d.getMinutes() + ':'+ d.getSeconds();
	var margines = 35;
	var linia = 150;
	doc.setFontSize(9);
	doc.text("Data kalkulacji: " + dataCzas,margines, linia); linia += 20;
	//
	if (typDanych == 0) doc.text("Typ kalkulacji:  Kalkulacja wg wlasnych danych",margines, linia);
	else doc.text("Typ kalkulacji:  Porownywanie kredytow",margines, linia); 
	linia += 20; 
	//
	doc.text("Kwota kredytu: " + $scope.creditAmount, margines,linia); linia += 20;
	//
	doc.text("Wartosc nieruchomosci: " + $scope.estateValue, margines, linia); linia += 20;
	//
	doc.text("Czas kredytowania w miesiacach: " + $scope.creditTime, margines, linia); linia += 20;
	//
	if (typDanych == 0)
	{
		doc.text("Marza: " + $scope.spread, margines, linia); linia += 20;
		//
		doc.text("Prowizja: " + $scope.commision, margines, linia); linia += 20;
		//
		str = "Rodzaj rat: ";
		str += $scope.installmentType == "FixedRate" ? "Stale" : "Zmienne";
		doc.text(str, margines, linia); linia += 20;
		//
		str = "Automatyczne pobieranie stopy procentowej: ";
		str += $scope.showAutomateRatioParameters == "InterestRateYes" ? "Tak" : "Nie";
		doc.text(str, margines, linia); linia += 20;
		//
		if ($('#InterestRateYes').is(':checked'))
		{
			str = "Waluta kredytu: " 
			if ($scope.Currency == "WIBOR") str += "PLN";
			else if ($scope.Currency == "EURIBOR") str += "EURO";
			else if ($scope.Currency == "LIBOR") str += "CHF";
			doc.text(str, margines, linia); linia += 20;
			//
			str = "Okres czasowy dla stopy procentowej: ";
			if ($scope.RateTime == "1M") str += "1M";
			else if ($scope.RateTime == "3M") str += "3M";
			else if ($scope.RateTime == "6M") str += "6M";
			doc.text(str, margines, linia); linia += 20;
		}
		else
		{
			doc.text("Wartosc stopy procentowej: " + $scope.InterestRate, margines, linia); linia += 20;
		}
		//
		linia += 50;
		var columns = ["Rodzaj kalk.", "Kwota kredytu", "Kwota do splaty", "Koszt odsetek", "Koszt prow.", "Oprocentowanie", "LTV"];	
		doc.autoTable(columns, globalCreditSummary, { startY: linia });
		linia += 60;
		var columns2 = ["Nr raty", "Rata", "Kapital", "Odsetki", "Kwota pozostala do splaty"];
		doc.autoTable(columns2, globalSchedule, { startY: linia });
		//
		doc.addPage();
		//$('a[href="scheduleTab"]').click();
		//$('a[href="#installmentTab"]').click();
		//$('a[href="capitalTab"]').click();
		//$('a[href="differentRatesTab"]').click();
		AddImage('installmentDetailsChart', doc, 20);
		AddImage('remainingCapitalInTimeChart', doc, 300);
		//
		doc.addPage();
		var columns3 = ["Akt. st. opr.", "Akt. st. opr. + 2pp", "Akt. st. opr. + 5pp", "Akt. st. opr. + 10pp"];	
		linia = 70;
		doc.autoTable(columns3, globalInstallmentsDifferentRates, { startY: linia });
	}
	if (typDanych == 1)
	{
		var columns4 = ["Lp.", "Bank", "Rata", "Kwota do splaty"];	
		doc.autoTable(columns4, globalComparedCredits, { startY: linia });
	}	
	//
	var nazwa_data_czas = d.getFullYear() + '_' + (month < 10 ? '0' : '') + month + '_' + (day < 10 ? '0' : '') + day + "_" + d.getHours() + '_'+ d.getMinutes() + '_'+ d.getSeconds();
	doc.save("kalkulacja_kredytowa_" + nazwa_data_czas + ".pdf");
}

function AddImage(srcCanvasName, doc, linia)
{
	var srcCanvas = document.getElementById(srcCanvasName);
    var destinationCanvas = document.createElement("canvas");
    destinationCanvas.width = srcCanvas.width;
    destinationCanvas.height = srcCanvas.height;
    var destCtx = destinationCanvas.getContext('2d');
    destCtx.fillStyle = "#FFFFFF";
    destCtx.fillRect(0,0,srcCanvas.width,srcCanvas.height);
    destCtx.drawImage(srcCanvas, 0, 0);
    destinationCanvas.toDataURL("image/jpeg", 1.0);
    doc.addImage(destinationCanvas, 'JPEG', 20, linia, srcCanvas.width/1.5, srcCanvas.height/1.5);
}