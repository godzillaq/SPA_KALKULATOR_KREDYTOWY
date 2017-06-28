# Kalkulator kredytowy

Porównywarka ofert kredytów hipotecznych

![](http://www.ideapractices.org/wp-content/uploads/2013/01/Credit-Union-logo1.jpg)

# Opis

Celem projektu było stworzenie kalkulatora kredytowego. Powstały projekt pozwala na kalkulacje ofert kredytowych w dwóch wariantach. Pierwszy wariant pozwala na przeprowadzenie kalkulacji na podstawie danych wprowadzonych przez użytkownika, dane te dotyczą kwoty kredytu, wartości nieruchomości, czasu kredytowania, marży, prowizji, rodzaju rat, jednej z trzech dostępnych walut oraz okresu czasowego dla stopy procentowej. Wariant ten umożliwia także automatyczne pobieranie stopy procentowej, w przypadku jej nie wybrania należy wprowadzić wartość stopy procentowej ręcznie. Drugim wariantem jest porównanie kredytów na podstawie danych pobranych z api. Użytkownik podaje kwotę kredytu oraz wartość nieruchomości i czas kredytowania. W kolejnym kroku wyliczone zostaną dane z poszczególnych najpopularniejszych banków.

# Funkcjonalności

- wyliczanie oprocentowania na podstawie podanych danych (prowizja, oprocentowanie, liczba miesięcy, kwota)
- pobieranie poprzez API aktualnych stóp procentowych dla różnych walut (WIBOR, EURIBOR, LIBOR)
- wyliczanie jak zmienią się warunki kredytu, gdy zmianie ulegną stopy procentowe
- pobieranie poprzez API aktualnych przykładowych ofert banków i porównywanie ofert dla wprowadzonych parametrów
- generowanie wykresów wizualizujących warunki kredytu
- raty stałe, raty malejące
- kalkulator nadpłat w celu weryfikacji korzyści z nadpłaconych wpłat
- zapisywanie kalkulacji
- generowanie kalkulacji do PDF
