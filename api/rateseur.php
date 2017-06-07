<?php
class RateInfo {
    public $rateName;
	public $value;
}

// Include the php dom parser    
include_once 'simple_html_dom.php';

// Create DOM from URL or file

$html = file_get_html('http://www.bankier.pl/kredyty-hipoteczne/stopy-procentowe/euribor');
foreach($html ->find('span') as $item) {
    $item->outertext = '';
    }
$html->save();

$table = $html->find('table.summaryTable')[0];


$first=array();

$rates = array();

$trs = $table->find('tr');
array_shift ($trs);
array_pop ($trs);


foreach($trs as $row) {
    // initialize array to store the cell data from each row
    $rowData = array();
	
	$onerow = $row->find('td');
	$i = 0;
	$obj = new RateInfo();
	
	foreach($onerow as $onetd) {
		if ($i == 0) {
			$obj->rateName = $onetd->find('a', 0)->plaintext;
		}
		if ($i == 1) {
			$obj->value = $onetd->innertext;
		}
		$i = $i + 1;
	}
	array_push($rates, $obj);
    // push the row's data array to the 'big' array
    $theData[] = $rowData;
}
$myJSON = json_encode($rates);

echo $myJSON;

?> 