<?php
 $connection = mysql_connect("localhost", "root", "");
 $db = mysql_select_db("test", $connection);

//Fetching Values from URL  



 $email=$_POST['email_'];
//$password= sha1($_POST['password1']);  // Password Encryption, If you like you can also leave sha1
 $haslo= $_POST['haslo_'];  // Password Encryption, If you like you can also leave sha1
// check if e-mail address syntax is valid or not
//$email = filter_var($email, FILTER_SANITIZE_EMAIL); // sanitizing email(Remove unexpected symbol like <,>,?,#,!, etc.)
 $operacja=$_POST['operacja_'];
 

 if ($operacja == "logowanie")
 {
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
 
 

	
mysql_close ($connection);
?>