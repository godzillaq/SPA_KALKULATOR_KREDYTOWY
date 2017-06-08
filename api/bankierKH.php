<?php
class RateInfo {
    public $Bank;
	public $Oprocentowanie;
	public $Marza;
}

class KredytyInfo
{
	public $Nazwa;
	public $Dane = [];
}

// Include the php dom parser    
include_once 'simple_html_dom.php';

// Create DOM from URL or file

$html = file_get_html('http://www.bankier.pl/wiadomosc/Najlepsze-kredyty-hipoteczne-kwiecien-2017-Ranking-Bankier-pl-7512819.html');
$bigArray = array();

// LTV 90 Nowy klient

$table = $html->find('table')[0];
$rates = array();


$trs = $table->find('tr');
array_shift ($trs);
array_shift ($trs);
array_pop ($trs);

foreach($trs as $row) 
{
	$onerow = $row->find('td');
	$i = 0;
	$obj = new RateInfo();
	
	foreach($onerow as $onetd) 
	{
		if ($i == 1) 
		{
			$obj->Bank = $onetd->plaintext;
		}
		if ($i == 2) 
		{
			$obj->Oprocentowanie = $onetd->plaintext;
		}
		if ($i == 3) 
		{
			$obj->Marza = $onetd->plaintext;
		}
		$i = $i + 1;
	}
	array_push($rates, $obj);
}
$obiekt = new KredytyInfo();
$obiekt->Nazwa = "LTV90NK";
$obiekt->Dane = $rates;

array_push($bigArray, $obiekt);


// LTV 90 Stały klient

$table = $html->find('table')[1];
$rates = array();

$trs = $table->find('tr');
array_shift ($trs);
array_shift ($trs);
array_pop ($trs);

foreach($trs as $row) 
{
	$onerow = $row->find('td');
	$i = 0;
	$obj = new RateInfo();
	
	foreach($onerow as $onetd) 
	{
		if ($i == 1) 
		{
			$obj->Bank = $onetd->plaintext;
		}
		if ($i == 2) 
		{
			$obj->Oprocentowanie = $onetd->plaintext;
		}
		if ($i == 3) 
		{
			$obj->Marza = $onetd->plaintext;
		}
		$i = $i + 1;
	}
	array_push($rates, $obj);
}
$obiekt = new KredytyInfo();
$obiekt->Nazwa = "LTV90SK";
$obiekt->Dane = $rates;

array_push($bigArray, $obiekt);

// LTV 80 Nowy klient

$table = $html->find('table')[2];
$rates = array();

$trs = $table->find('tr');
array_shift ($trs);
array_shift ($trs);
array_pop ($trs);

foreach($trs as $row) 
{
	$onerow = $row->find('td');
	$i = 0;
	$obj = new RateInfo();
	
	foreach($onerow as $onetd) 
	{
		if ($i == 1) 
		{
			$obj->Bank = $onetd->plaintext;
		}
		if ($i == 2) 
		{
			$obj->Oprocentowanie = $onetd->plaintext;
		}
		if ($i == 3) 
		{
			$obj->Marza = $onetd->plaintext;
		}
		$i = $i + 1;
	}
	array_push($rates, $obj);
}
$obiekt = new KredytyInfo();
$obiekt->Nazwa = "LTV80NK";
$obiekt->Dane = $rates;

array_push($bigArray, $obiekt);

// LTV 80 Stały klient

$table = $html->find('table')[3];
$rates = array();

$trs = $table->find('tr');
array_shift ($trs);
array_shift ($trs);
array_pop ($trs);

foreach($trs as $row) 
{
	$onerow = $row->find('td');
	$i = 0;
	$obj = new RateInfo();
	
	foreach($onerow as $onetd) 
	{
		if ($i == 1) 
		{
			$obj->Bank = $onetd->plaintext;
		}
		if ($i == 2) 
		{
			$obj->Oprocentowanie = $onetd->plaintext;
		}
		if ($i == 3) 
		{
			$obj->Marza = $onetd->plaintext;
		}
		$i = $i + 1;
	}
	array_push($rates, $obj);
}
$obiekt = new KredytyInfo();
$obiekt->Nazwa = "LTV80SK";
$obiekt->Dane = $rates;

array_push($bigArray, $obiekt);

$myJSON = json_encode($bigArray);

echo $myJSON;

?> 