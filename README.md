# Instrukcja uruchomienia projektu Angular

## Wymagania wstępne

1. **Node.js** (wersja LTS lub nowsza) - Pobierz i zainstaluj z [Node.js](https://nodejs.org/).
2. **Angular CLI** (wersja zgodna z projektem) - Zainstaluj globalnie za pomocą polecenia: ```npm install -g @angular/cli```

## Uruchomienie projektu i budowanie wersji produkcyjnej
1. **Instalacja bibliotek** W katalogu głównym projektu użyj: `npm install`
2. **Uruchomienie** W katalogu głównym projektu użyj: `ng serve`
3. **Build** W katalogu głównym projektu użyj: `ng build`

## Testy jednostkowe
1. **Testy** W katalogu głównym projektu użyj: `ng test`


## Opis architektury aplikacji Angular ##

**Struktura katalogów**

```
src/
├── app/
│   ├── views/
│   │   ├── pets/
│   │   │   ├── form/
│   │   │   ├── preview/
│   │   │   ├── list/
│   │   │   │   ├── filters/
│   ├── enums/
│   ├── interfaces/
│   ├── services/
│   │   ├── api/
│   ├── utils/
│   ├── pipes/
```

**Szczegółowy opis struktury**

1. **views/**
Folder zawiera komponenty widoków aplikacji, podzielone na podfoldery odpowiadające różnym funkcjonalnościom.

2. **views/pets/**
Sekcja aplikacji związana z zarządzaniem danymi dotyczącymi zwierząt (pets). Zawiera podfoldery odpowiadające różnym funkcjonalnościom:
```/form - Komponent odpowiadający za edycję i dodawanie zwierząt.
/preview - Komponent wyświetlający szczegółowe informacje o wybranym zwierzęciu.
/list - Komponent odpowiedzialny za wyświetlanie listy zwierząt. Dodatkowo zawiera:
    /list/filters - Podkomponent implementujący filtry dla listy zwierząt.
```
3. **enums/**
Folder zawiera pliki z enumeracjami (Enum), które są wykorzystywane w różnych częściach aplikacji do przechowywania stałych wartości.

4. **interfaces/**
Folder zawiera pliki z typami i interfejsami, które definiują struktury danych używane w aplikacji.

5. **services/**
Folder odpowiedzialny za logikę biznesową i interakcję z API.
``api/ - Zawiera serwisy realizujące komunikację z API, np. pets.service.ts wykonujący żądania HTTP związane z danymi zwierząt.``
``pets-fascade.service.ts - Serwis zarządzający stanem aplikacji w obszarze listy zwierząt. Abstrahuje logikę pomiędzy komponentami a API.``

6. **utils/**
Zbiór pomocniczych funkcji, które mogą być wielokrotnie używane w różnych częściach aplikacji, np. formatowanie danych czy operacje na kolekcjach.

7. **pipes/**
Folder przechowuje niestandardowe pipe'y, które przetwarzają dane w szablonach HTML, np. formatowanie tekstu czy filtrowanie list.

## Użyte technologie/biblioteki ##

1. **Angular v17**
2. **RXJS**
3. **Angular material**
4. **Jasmine/Karma**
