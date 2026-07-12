# Marcador Continental

## Tech details
* Web application with nextjs, typescript, shadcn and tailwind
* The app is for mobile browsers, so it should be responsive and mobile-first
+ UI language is spanish

## Business rules
The app is a score board for a spanish cards game called "Continental".
Game information is saved on browser cookies, so it should have the usual "accept cookies" modal with the corresponding warning that if cookies are not accepted app cannot work.

### Game rules
* There are 7 rounds
  * Round 1: Dos tríos
  * Round 2: Un trío y una escalera
  * Round 3: Dos escaleras
  * Round 4: Tres tríos
  * Round 5: Dos tríos y una escalera
  * Round 6: Un trío y dos escaleras
  * Round 7: Tres escaleras
* Up to 6 players
* App has the capability to create a new game
  * When game is created, user should enter the players name. Each player is identified with a random color.
  * Game should save time and date.
* During game, user can close a session entering points for each player. App should have the ability to enter -10 as player points.
* App should display games history