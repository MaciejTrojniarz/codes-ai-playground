# Dokument wymagań produktu (PRD) - [Nazwa Aplikacji] (Wersja Web - Full Cloud)

## 1. Przegląd produktu

[Nazwa Aplikacji] to aplikacja webowa (MVP) dostępna przez przeglądarkę internetową. Jej celem jest pomoc użytkownikom w zarządzaniu kodami rabatowymi otrzymywanymi głównie na paragonach sklepowych. Aplikacja wymaga założenia konta i logowania. Wszystkie dane użytkownika, w tym szczegóły kodów rabatowych, statystyki użycia oraz powiązane zdjęcia paragonów, są przechowywane i synchronizowane w chmurze za pomocą platformy Supabase. Dzięki temu użytkownik ma dostęp do swoich danych z dowolnego urządzenia z dostępem do internetu po zalogowaniu. Aplikacja wymaga aktywnego połączenia z internetem do pełnego działania.

## 2. Problem użytkownika

Użytkownicy często otrzymują kody rabatowe na kolejny zakup drukowane bezpośrednio na paragonach. Ze względu na format, paragony te łatwo ulegają zniszczeniu, zgubieniu lub zapomnieniu. Przechowywanie ich fizycznie jest nieefektywne. Brak centralnego, dostępnego zewsząd miejsca do zarządzania tymi kodami prowadzi do utraty potencjalnych oszczędności, ponieważ użytkownicy nie wykorzystują posiadanych rabatów przed upływem ich terminu ważności.

## 3. Wymagania funkcjonalne

Aplikacja webowa w wersji MVP będzie posiadać następujące funkcjonalności, opierając się na platformie Supabase:

3.1. Zarządzanie kontem użytkownika (Supabase Auth):
    - Rejestracja nowego konta (e-mail/hasło).
    - Logowanie do istniejącego konta.
    - Wylogowanie.
    - (Zalecane) Mechanizm resetowania hasła.
3.2. Dodawanie nowego kodu rabatowego (Supabase Database + Storage):
    - Formularz webowy do wprowadzenia danych: Nazwa sklepu (wymagane), Data ważności (DD.MM.RRRR, wymagane), Kod rabatowy (tekst, opcjonalny), Warunki promocji (opcjonalne), Minimalna kwota zakupu (opcjonalna).
    - Możliwość wysłania (uploadu) pliku zdjęcia paragonu z urządzenia użytkownika do Supabase Storage.
    - Walidacja formatu daty ważności.
    - Wymóg podania przynajmniej kodu tekstowego LUB wysłania zdjęcia.
    - Zapisanie danych tekstowych kodu oraz linku/referencji do zapisanego zdjęcia w bazie danych Supabase, powiązanych z kontem użytkownika.
3.3. Lista aktywnych kodów (Dane z Supabase):
    - Główny widok aplikacji pobierający i wyświetlający listę aktywnych (nieużytych i nieprzeterminowanych) kodów dla zalogowanego użytkownika z bazy danych Supabase.
    - Domyślne sortowanie listy według daty ważności (od najwcześniejszej) - sortowanie realizowane po stronie Supabase lub aplikacji.
    - Wizualne wyróżnienie kodów, których termin ważności upływa w ciągu najbliższych 3 dni.
    - Wyświetlanie kluczowych informacji dla każdego kodu: Nazwa sklepu, Data ważności, Kod (jeśli wpisany), Miniaturka zdjęcia (pobrana z Supabase Storage).
3.4. Edycja kodu (Supabase Database + Storage):
    - Możliwość edycji wszystkich pól tekstowych zapisanego kodu.
    - Możliwość zastąpienia/usunięcia powiązanego zdjęcia (aktualizacja w Supabase Storage i bazie danych).
    - Zmiany zapisywane są w bazie danych Supabase.
3.5. Oznaczanie jako użyty (Aktualizacja w Supabase):
    - Możliwość ręcznego oznaczenia kodu jako "użyty".
    - Aktualizacja statusu kodu w bazie danych Supabase.
    - Zaktualizowane dane wpływają na statystyki użytkownika w Supabase.
3.6. Automatyczne oznaczanie jako przeterminowany (Logika po stronie Supabase/Aplikacji):
    - Identyfikacja kodów, których data ważności minęła (na podstawie danych w Supabase).
    - Automatyczna aktualizacja statusu kodu na "przeterminowany" w bazie danych Supabase.
    - Zaktualizowane dane wpływają na statystyki użytkownika w Supabase.
3.7. Archiwum kodów (Dane z Supabase):
    - Osobny widok/sekcja aplikacji pobierająca i wyświetlająca listę kodów oznaczonych jako "użyte" lub "przeterminowane" dla zalogowanego użytkownika z bazy danych Supabase.
    - Brak sortowania/wyszukiwania w Archiwum w wersji MVP.
    - Możliwość trwałego usunięcia kodu z Archiwum (usunięcie rekordu z bazy danych Supabase oraz powiązanego pliku zdjęcia z Supabase Storage).
    - Możliwość przywrócenia kodu z Archiwum na listę aktywnych (zmiana statusu w bazie danych Supabase).
3.8. Wyświetlanie zdjęcia (Z Supabase Storage):
    - Możliwość wyświetlenia pełnego zdjęcia paragonu powiązanego z kodem, pobranego z Supabase Storage.
    - Podstawowe funkcje zoomowania/przesuwania w przeglądarce (jeśli natywnie obsługiwane przez przeglądarkę lub z użyciem prostej biblioteki JS).
3.9. Statystyki (Dane z Supabase):
    - Osobny widok "Statystyki" pobierający i wyświetlający podsumowanie dla bieżącego miesiąca (liczba kodów użytych vs przeterminowanych) z danych zagregowanych w Supabase dla zalogowanego użytkownika.
    - Skrócone podsumowanie statystyk z bieżącego miesiąca (pobrane z Supabase) widoczne w interfejsie aplikacji (np. w nagłówku).
3.10. Wymóg Połączenia z Internetem:
    - Aplikacja wymaga aktywnego połączenia z internetem do pobierania danych, zapisywania zmian, wysyłania/pobierania zdjęć i uwierzytelniania. Funkcjonalność offline nie jest wspierana w MVP.
3.11. Wykorzystanie Platformy Supabase:
    - Wszystkie funkcje backendowe (uwierzytelnianie, baza danych dla kodów i statystyk, przechowywanie plików zdjęć) będą realizowane przy użyciu usług platformy Supabase (Auth, Database, Storage).
    - Aplikacja webowa będzie komunikować się z Supabase za pomocą dostarczonego SDK JavaScript.

## 4. Granice produktu

Następujące funkcje i cechy znajdują się poza zakresem wersji MVP:

4.1. Funkcjonalność offline (aplikacja wymaga połączenia z internetem).
4.2. Automatyczne rozpoznawanie tekstu (OCR) ze zdjęć paragonów.
4.3. Zaawansowane opcje sortowania, filtrowania i wyszukiwania kodów (poza domyślnym sortowaniem wg daty ważności).
4.4. Możliwość dodawania własnych tagów lub kategorii (poza nazwą sklepu).
4.5. Funkcje społecznościowe (np. dzielenie się kodami).
4.6. Powiadomienia (ani webowe, ani e-mailowe) o wygasających kodach.
4.7. Zbieranie i analiza zagregowanych danych analitycznych o użytkowaniu aplikacji (poza statystykami per użytkownik przechowywanymi w Supabase).
4.8. Wbudowane mechanizmy zbierania opinii od użytkowników.
4.9. Logowanie za pomocą kont społecznościowych (MVP obejmuje tylko email/hasło przez Supabase Auth).
4.10. Zaawansowane zarządzanie plikami (np. foldery, edycja zdjęć online).
4.11. Wsparcie dla specyficznych, starszych przeglądarek internetowych (należy zdefiniować minimalne wspierane wersje).

## 5. Historyjki użytkowników

- ID: US-001
- Tytuł: Dodawanie nowego kodu rabatowego (ze zdjęciem i kodem) przez stronę WWW
- Opis: Jako zalogowany użytkownik, chcę móc dodać nowy kod rabatowy przez formularz webowy, wpisując jego dane (sklep, data ważności, kod) i wysyłając zdjęcie paragonu, aby zapisać go na moim koncie w chmurze.
- Kryteria akceptacji:
    - Mogę otworzyć formularz dodawania nowego kodu w aplikacji webowej.
    - Mogę wpisać nazwę sklepu (pole wymagane).
    - Mogę wybrać datę ważności z kontrolki kalendarza (pole wymagane, format DD.MM.RRRR).
    - Mogę wpisać tekstowy kod rabatowy.
    - Mogę wybrać plik zdjęcia z mojego urządzenia.
    - Po kliknięciu "Zapisz", dane tekstowe są zapisywane w bazie Supabase, a zdjęcie jest wysyłane do Supabase Storage.
    - Po pomyślnym zapisie i wysłaniu zdjęcia, widzę nowy kod na liście aktywnych kodów pobranej z Supabase.
    - Widzę informację o postępie wysyłania zdjęcia lub ewentualnym błędzie.
    - Nie mogę zapisać kodu bez podania nazwy sklepu lub daty ważności.
    - Nie mogę zapisać kodu bez podania kodu tekstowego LUB wysłania zdjęcia.

- ID: US-002
- Tytuł: Dodawanie nowego kodu rabatowego (tylko ze zdjęciem) przez stronę WWW
- Opis: Jako zalogowany użytkownik, chcę móc dodać nowy kod rabatowy, wpisując tylko nazwę sklepu i datę ważności oraz wysyłając zdjęcie paragonu, zapisując go na moim koncie w chmurze.
- Kryteria akceptacji:
    - Mogę otworzyć formularz dodawania nowego kodu.
    - Mogę wpisać nazwę sklepu i wybrać datę ważności.
    - Mogę pozostawić pole kodu rabatowego puste.
    - Muszę wybrać plik zdjęcia do wysłania.
    - Po kliknięciu "Zapisz", dane są zapisywane w Supabase, a zdjęcie wysyłane do Supabase Storage.
    - Widzę nowy kod na liście aktywnych kodów.

- ID: US-003
- Tytuł: Dodawanie nowego kodu rabatowego (tylko z kodem tekstowym) przez stronę WWW
- Opis: Jako zalogowany użytkownik, chcę móc dodać nowy kod rabatowy, wpisując jego dane (sklep, data ważności, kod), ale bez wysyłania zdjęcia, zapisując go na moim koncie w chmurze.
- Kryteria akceptacji:
    - Mogę otworzyć formularz dodawania nowego kodu.
    - Mogę wpisać nazwę sklepu, wybrać datę ważności i wpisać kod tekstowy.
    - Mogę nie wybierać pliku zdjęcia.
    - Po kliknięciu "Zapisz", dane tekstowe są zapisywane w bazie Supabase.
    - Widzę nowy kod na liście aktywnych kodów.

- ID: US-004
- Tytuł: Przeglądanie listy aktywnych kodów (pobranej z chmury)
- Opis: Jako zalogowany użytkownik, chcę widzieć w aplikacji webowej listę wszystkich moich aktywnych kodów rabatowych pobraną z Supabase i posortowaną według daty ważności.
- Kryteria akceptacji:
    - Po zalogowaniu, główny widok aplikacji pobiera listę moich aktywnych kodów z bazy Supabase.
    - Lista zawiera tylko kody aktywne (nieużyte i nieprzeterminowane).
    - Kody są posortowane rosnąco według daty ważności.
    - Każdy element listy pokazuje nazwę sklepu, datę ważności, kod (jeśli jest) i miniaturkę zdjęcia (jeśli jest, pobraną z Supabase Storage).
    - Aplikacja pokazuje stan ładowania danych lub komunikat o błędzie, jeśli pobranie danych z Supabase się nie powiedzie.

- ID: US-005
- Tytuł: Wyróżnianie kodów bliskich wygaśnięcia na liście
- Opis: Jako użytkownik, chcę, aby kody, które wkrótce wygasną, były wyraźnie wyróżnione na liście pobranej z chmury, abym łatwo je zauważył.
- Kryteria akceptacji:
    - Kody na liście, których data ważności (z Supabase) przypada w ciągu najbliższych 3 dni, mają inne tło lub oznaczenie wizualne.
    - Kody z późniejszą datą ważności nie są wyróżnione.

- ID: US-006
- Tytuł: Oznaczanie kodu jako użyty (aktualizacja w chmurze)
- Opis: Jako zalogowany użytkownik, chcę móc oznaczyć kod jako "użyty", co zaktualizuje jego status w bazie Supabase i wpłynie na moje statystyki.
- Kryteria akceptacji:
    - Przy każdym kodzie na liście aktywnej widoczny jest przycisk "Użyłem".
    - Po naciśnięciu przycisku, status kodu jest aktualizowany na "użyty" w bazie danych Supabase.
    - Kod znika z listy aktywnych kodów (po odświeżeniu danych z Supabase).
    - Akcja ta jest odnotowywana w statystykach użytkownika w Supabase.

- ID: US-007
- Tytuł: Edycja istniejącego kodu (aktualizacja w chmurze)
- Opis: Jako zalogowany użytkownik, chcę móc edytować dane zapisanego kodu (tekstowe i zdjęcie), a zmiany te powinny zostać zapisane w Supabase.
- Kryteria akceptacji:
    - Mogę otworzyć widok edycji dla wybranego kodu.
    - Widzę formularz edycji wypełniony aktualnymi danymi pobranymi z Supabase.
    - Mogę zmodyfikować pola tekstowe.
    - Mogę wysłać nowe zdjęcie, aby zastąpić istniejące (stare zdjęcie w Supabase Storage może zostać usunięte lub zarchiwizowane). Mogę usunąć powiązane zdjęcie.
    - Po zapisaniu zmian, zaktualizowane dane są wysyłane i zapisywane w bazie danych Supabase (i ew. Supabase Storage).
    - Zaktualizowane dane są widoczne po odświeżeniu listy kodów.

(Historyjka US-008 - Powiadomienia - Usunięta)
(Historyjka US-009 - Zgoda na powiadomienia - Usunięta)

- ID: US-010
- Tytuł: Przeglądanie Archiwum kodów (pobranych z chmury)
- Opis: Jako zalogowany użytkownik, chcę mieć dostęp do listy kodów (pobranej z Supabase), które już wykorzystałem lub które wygasły.
- Kryteria akceptacji:
    - Mogę przejść do sekcji Archiwum w aplikacji webowej.
    - Aplikacja pobiera listę moich kodów ze statusem "Użyty" lub "Przeterminowany" z bazy Supabase.
    - Widzę listę zarchiwizowanych kodów.
    - Kody przeterminowane (których data ważności minęła) mają automatycznie aktualizowany status w Supabase (przez logikę backendową/funkcje Supabase lub okresowe zadania).

- ID: US-011
- Tytuł: Trwałe usuwanie kodu z Archiwum (z chmury)
- Opis: Jako zalogowany użytkownik, chcę móc trwale usunąć kod z Archiwum, co usunie jego dane i zdjęcie z Supabase.
- Kryteria akceptacji:
    - Przy każdym kodzie w Archiwum widoczny jest przycisk "Usuń Trwale".
    - Po naciśnięciu przycisku i potwierdzeniu, rekord kodu jest usuwany z bazy danych Supabase.
    - Powiązany plik zdjęcia jest usuwany z Supabase Storage.
    - Kod znika z widoku Archiwum.

- ID: US-012
- Tytuł: Przywracanie kodu z Archiwum (aktualizacja w chmurze)
- Opis: Jako zalogowany użytkownik, chcę móc przywrócić kod z Archiwum na listę aktywnych, zmieniając jego status w Supabase.
- Kryteria akceptacji:
    - Przy każdym kodzie w Archiwum widoczny jest przycisk "Przywróć".
    - Po naciśnięciu przycisku, status kodu jest aktualizowany na "aktywny" w bazie danych Supabase.
    - Kod znika z widoku Archiwum.
    - Kod pojawia się ponownie na liście aktywnych kodów (po odświeżeniu).
    - Przywrócenie jest możliwe tylko, jeśli data ważności kodu nie jest przeszła.

- ID: US-013
- Tytuł: Podgląd zdjęcia paragonu (z chmury)
- Opis: Jako zalogowany użytkownik, chcę móc otworzyć i powiększyć zdjęcie paragonu powiązane z kodem, pobierając je z Supabase Storage.
- Kryteria akceptacji:
    - Mogę kliknąć na miniaturkę zdjęcia na liście kodów lub w widoku szczegółów.
    - Aplikacja pobiera i wyświetla pełne zdjęcie z Supabase Storage.
    - Mogę powiększać/przesuwać zdjęcie (korzystając z funkcji przeglądarki lub prostej biblioteki JS).
    - Mogę zamknąć podgląd zdjęcia.

- ID: US-014
- Tytuł: Sprawdzanie statystyk wykorzystania kodów (pobranych z chmury)
- Opis: Jako zalogowany użytkownik, chcę widzieć podsumowanie, ile kodów wykorzystałem, a ile mi przepadło w bieżącym miesiącu, pobierając te zagregowane dane z Supabase.
- Kryteria akceptacji:
    - Mogę przejść do widoku "Statystyki".
    - Aplikacja pobiera zagregowane dane statystyczne dla mojego konta z Supabase dla bieżącego miesiąca.
    - Widzę pobrane podsumowanie: "Kody użyte: X", "Kody przeterminowane: Y".
    - Na stronie głównej (np. w nagłówku) widzę skrócone podsumowanie dla bieżącego miesiąca pobrane z Supabase.
    - W przypadku braku połączenia z internetem, wyświetlany jest komunikat o błędzie.

(Historyjka US-015 - Obsługa braku lokalnego zdjęcia - Usunięta; ewentualne błędy ładowania z Supabase Storage są obsługiwane w US-013/US-004)

- ID: US-016
- Tytuł: Rejestracja nowego konta użytkownika przez Supabase (Web)
- Opis: Jako nowy użytkownik, chcę móc zarejestrować konto w aplikacji webowej za pomocą adresu e-mail i hasła, korzystając z usługi Supabase Auth.
- Kryteria akceptacji:
    - Na stronie głównej/logowania widzę opcję "Zarejestruj się".
    - Mogę przejść do formularza rejestracji.
    - Mogę wprowadzić adres e-mail i hasło (z potwierdzeniem hasła).
    - Walidacja danych wejściowych po stronie klienta i/lub serwera (Supabase).
    - Po kliknięciu "Zarejestruj", aplikacja webowa komunikuje się z Supabase Auth w celu utworzenia konta.
    - Po pomyślnej rejestracji, zostaję automatycznie zalogowany i przekierowany do głównego widoku aplikacji.
    - W przypadku błędów (np. zajęty email) widzę odpowiedni komunikat.

- ID: US-017
- Tytuł: Logowanie do aplikacji przez Supabase (Web)
- Opis: Jako zarejestrowany użytkownik, chcę móc zalogować się do aplikacji webowej za pomocą adresu e-mail i hasła, korzystając z Supabase Auth.
- Kryteria akceptacji:
    - Na stronie głównej widzę formularz logowania.
    - Mogę wprowadzić e-mail i hasło.
    - Po kliknięciu "Zaloguj", aplikacja webowa komunikuje się z Supabase Auth w celu weryfikacji.
    - Po pomyślnym zalogowaniu, zostaję przekierowany do głównego widoku aplikacji, a sesja użytkownika jest ustanowiona (np. za pomocą tokenów JWT zarządzanych przez Supabase SDK).
    - W przypadku błędnych danych, widzę komunikat.

- ID: US-018
- Tytuł: Wylogowanie z aplikacji (sesja Supabase Web)
- Opis: Jako zalogowany użytkownik, chcę móc wylogować się z mojego konta w aplikacji webowej.
- Kryteria akceptacji:
    - W interfejsie aplikacji (np. w menu użytkownika) znajduje się opcja "Wyloguj".
    - Po kliknięciu "Wyloguj", aplikacja webowa wywołuje funkcję wylogowania Supabase Auth, kończąc sesję.
    - Zostaję przekierowany do strony logowania.

- ID: US-019
- Tytuł: Resetowanie zapomnianego hasła przez Supabase (Web)
- Opis: Jako użytkownik, który zapomniał hasła, chcę móc zainicjować proces jego resetowania za pomocą funkcji Supabase Auth w aplikacji webowej.
- Kryteria akceptacji:
    - Na stronie logowania znajduje się link "Zapomniałem hasła".
    - Po kliknięciu linku, mogę wprowadzić adres e-mail powiązany z kontem.
    - Aplikacja webowa wywołuje funkcję resetowania hasła Supabase Auth.
    - Otrzymuję e-mail od Supabase z linkiem do ustawienia nowego hasła (standardowy przepływ Supabase).
    - Mogę ustawić nowe hasło i zalogować się przy jego użyciu.

## 6. Metryki sukcesu

Sukces wersji MVP aplikacji webowej będzie mierzony głównie poprzez dane dostępne dzięki Supabase:

6.1. Główny wskaźnik KPI: Stosunek liczby kodów oznaczonych jako "zrealizowane" do liczby kodów, które stały się "przeterminowane" w danym miesiącu kalendarzowym dla użytkownika.
    - Sposób pomiaru: Agregacja danych w bazie Supabase. Aplikacja pobiera i wyświetla te dane.
    - Prezentacja: Wyświetlanie wartości na dedykowanym widoku "Statystyki" oraz w skróconej formie w interfejsie aplikacji.
6.2. Liczba zarejestrowanych użytkowników (dostępna w panelu Supabase Auth).
6.3. Liczba aktywnych użytkowników (logujących się i wykonujących akcje, np. MAU - Monthly Active Users; częściowo dostępne w Supabase lub wymagające dodatkowej analityki).
6.4. Wolumen przechowywanych danych (liczba kodów, liczba i rozmiar zdjęć w Supabase Storage) - do monitorowania kosztów i skalowania.
6.5. (Jakościowo) Opinie pierwszych użytkowników dotyczące użyteczności, wydajności i niezawodności aplikacji webowej.
