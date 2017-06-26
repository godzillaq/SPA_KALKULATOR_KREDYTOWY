<?php
 $connection = mysql_connect("localhost", "root", "");
 $db = mysql_select_db("test", $connection);

//Fetching Values from URL  
 $operacja=$_POST['operacja_'];
 

 if ($operacja == "logowanie")
 {
	$email=$_POST['email_'];
	$haslo= $_POST['haslo_']; 
	$result = mysql_query("SELECT Id, Nazwa FROM Uzytkownik WHERE email='$email' AND haslo ='$haslo'");
	$data = mysql_num_rows($result);
	if ($data == 0) echo -1;
	else
	{
		while($row = mysql_fetch_assoc($result)) 
		{
			$obj = (object) ['Id' => $row["Id"], 'Nazwa' => $row["Nazwa"]];
			echo json_encode($obj);
		}
	}
 }
 
 if ($operacja == "rejestracja")
 {
	$email=$_POST['email_'];
	$haslo= $_POST['haslo_']; 
	$nazwa=$_POST['nazwa_'];
	$result = mysql_query("SELECT Id, Nazwa FROM Uzytkownik WHERE email='$email'");
	$data = mysql_num_rows($result);
	if ($data > 0)
	{
		 echo -1; // email zajęty
		 return;
	}
	else
	{
		$conn = mysqli_connect("localhost", "root", "", "test");
		$sql = "INSERT INTO uzytkownik(Nazwa, Email, Haslo, Aktywny) VALUES ('$nazwa','$email','$haslo',1)";
		mysqli_query($conn, $sql);
		$result = mysql_query("SELECT Id, Nazwa FROM Uzytkownik WHERE email='$email'");
		while($row = mysql_fetch_assoc($result)) 
		{
			$obj = (object) ['Id' => $row["Id"], 'Nazwa' => $row["Nazwa"]];
			echo json_encode($obj);
		}		 
	}
 }
 
 if ($operacja == "SetParamsKW")
 {
		$param=$_POST['paramKW_'];
		$obj = json_decode($param);
		$conn = mysqli_connect("localhost", "root", "", "test");
		$sql = "delete from parametry where id = "; $sql .= $obj->{'userId'};
		mysqli_query($conn, $sql);
		$sql = "insert into parametry(id, KwotaKredytu, WartoscNieruchomosci, CzasKredytowaniaWMiesiacach, Marza, Prowizja, RodzajRat, AutoPobieraniStopProc, WalutaKredytu, OkresCzasowyStopProc, WartoscStopProc, TypDanych)";
		$sql .= "VALUES("; $sql .= $obj->{'userId'}; $sql .= ", ";
		$sql .= "'"; $sql .= $obj->{'KwotaKredytu'}; $sql .= "', ";
		$sql .= "'"; $sql .= $obj->{'WartoscNieruchomosci'}; $sql .= "', ";
		$sql .= "'"; $sql .= $obj->{'CzasKredytowaniaWMiesiacach'}; $sql .= "', ";
		$sql .= "'"; $sql .= $obj->{'Marza'}; $sql .= "', ";
		$sql .= "'"; $sql .= $obj->{'Prowizja'}; $sql .= "', ";
		$sql .= "'"; $sql .= $obj->{'RodzajRat'}; $sql .= "', ";
		$sql .= "'"; $sql .= $obj->{'AutoPobieraniStopProc'}; $sql .= "', "; 
		$sql .= "'"; $sql .= $obj->{'WalutaKredytu'}; $sql .= "', ";
		$sql .= "'"; $sql .= $obj->{'OkresCzasowyStopProc'}; $sql .= "', ";
		$sql .= "'"; $sql .= $obj->{'WartoscStopProc'}; $sql .= "', "; 
		$sql .= "'"; $sql .= $obj->{'TypDanych'}; $sql .= "')";		
		mysqli_query($conn, $sql);
		echo $sql;
 }	
 
if ($operacja == "GetParamsKW")
{
	$userId=$_POST['userId_'];
	$result = mysql_query("SELECT KwotaKredytu, WartoscNieruchomosci, CzasKredytowaniaWMiesiacach, Marza, Prowizja, RodzajRat, AutoPobieraniStopProc, WalutaKredytu, OkresCzasowyStopProc, WartoscStopProc, TypDanych from parametry where id = $userId");
	$data = mysql_num_rows($result);
	if ($data == 0) echo -1;
	else
	{
		while($row = mysql_fetch_assoc($result)) 
		{
			$obj = (object) ['KwotaKredytu' => $row["KwotaKredytu"], 'WartoscNieruchomosci' => $row["WartoscNieruchomosci"], 
			'CzasKredytowaniaWMiesiacach' => $row["CzasKredytowaniaWMiesiacach"], 'Marza' => $row["Marza"],
			'Prowizja' => $row["Prowizja"], 'RodzajRat' => $row["RodzajRat"], 'AutoPobieraniStopProc' => $row["AutoPobieraniStopProc"], 
			'WalutaKredytu' => $row["WalutaKredytu"], 'OkresCzasowyStopProc' => $row["OkresCzasowyStopProc"], 'WartoscStopProc' => $row["WartoscStopProc"], 'TypDanych' => $row["TypDanych"]];
			echo json_encode($obj);
		}
	}
 }
mysql_close ($connection);
?>