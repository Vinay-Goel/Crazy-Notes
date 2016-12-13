/*

          CRAZY NOTES ------- JavaScript

*/

var Canvas= document. getElementById( "Canvas");
var c2d= Canvas. getContext( "2d");

Canvas. width= window. innerWidth/ 4;
Canvas. height= window. innerHeight* 9/ 10;

Canvas. style. position= "fixed";
Canvas. style. top= "1%";
Canvas. style. left= "37.5%";


var meCanvas= document. getElementById( "me");
var mc2d= meCanvas. getContext( "2d");

mc2d. canvas. width= window. innerWidth* 6/ 10;
mc2d. canvas. height= window. innerHeight* 1/ 12;

meCanvas. style. left= "20%";
meCanvas. style. bottom= "0%";
meCanvas. style. position= "fixed";




var animationSpeed= 20;

var gameDim= {hCount: 3, vCount: 3, blackNoteCnt: 2};

var noteDim= {l: Canvas. height/ gameDim. vCount, b: Canvas. width/ gameDim. hCount, speedY: 4, accY: 0.1, accSqY: 0.003, maxSpeedY: 11.5, minAccY: 0.03};

var _end= false;

var score= 0;

var lastNoteLoc= (gameDim. vCount- 1)* noteDim. l;

var noteArr= [];

var note= [];

var playerLoc= 0;


function generate( min, max)
{
  return Math. random()* (max- min+ 1)+ min;
}


function makeNewNote()
{
  for( var i= 0; i< gameDim. hCount; i++) note[ i]= 0;

  var tmp, key;

  for( var i= 0; i< gameDim. blackNoteCnt; i++)
  {
    if( i> 0) tmp= Math. floor( generate( 1, 10) );

    if( i== 0 || (i> 0 && tmp== 10)) key= Math. floor( generate( 1, gameDim. hCount) )- 1;

    note[ key]= 1;
  }
}


function _init()
{
  for( var i= 0; i< gameDim. hCount; i++) note. push( 0);

  for( var i= 0; i<= gameDim. vCount; i++)
  {
    var newNote= [];

    for( var j= 0; j< gameDim. hCount; j++) newNote. push( 0);

    if( i== 2)
    {
      makeNewNote();

      playerLoc= i;
    }

    for( var j= 0; j< gameDim. hCount; j++) newNote[ j]= note[ j];

    noteArr. push( newNote );
  }
}


function drawRect( canv, x1, y1, b1, l1, lw, fs, ss)
{
  canv. beginPath();

  canv. lineWidth= lw;
  canv. fillStyle= fs;
  canv. strokeStyle= ss;

  canv. rect( x1, y1, b1, l1);

  canv. fill();
  canv. stroke();
}


function drawNotes()
{
  var x1= 0;
  var y1= lastNoteLoc;

  for( var i= 0; i<= gameDim. vCount; i++)
  {
    x1= 0;

    for( var j= 0; j< gameDim. hCount; j++)
    {
      if( noteArr[ i][ j]== 0) drawRect( c2d, x1, y1, noteDim. b, noteDim. l, 1, "#c9c9c9", "#c9c9c9");
      if( noteArr[ i][ j]== 1) drawRect( c2d, x1, y1, noteDim. b, noteDim. l, 1, "#0e0f0f", "#c9c9c9");
      if( noteArr[ i][ j]== 2) drawRect( c2d, x1, y1, noteDim. b, noteDim. l, 1, "#798fa7", "#c9c9c9");

      x1+= noteDim. b;
    }

    y1-= noteDim. l;
  }
}


function check()
{
  for( var i= 0; i< gameDim. hCount; i++) if( noteArr[ 0][ i]== 1) _end= true;
}


function removeNote()
{
  for( var i= 0; i< gameDim. vCount; i++) for( var j= 0; j< gameDim. hCount; j++) noteArr[ i][ j]= noteArr[ i+ 1][ j];

  makeNewNote();

  for( var i= 0; i< gameDim. hCount; i++) noteArr[ gameDim. vCount][ i]= note[ i];
}


function gameOver()
{
  c2d. textAlign= "center";
  c2d. font= "30px Verdana";
  c2d. fillStyle= "red";
  c2d. fillText( "GAME OVER!", Canvas. width/ 2, Canvas. height/ 2);
}


function animate()
{
  if( _end)
  {
    gameOver();
    return;
  }

  mc2d. clearRect( 0, 0, meCanvas. width, meCanvas. height);

  drawMe();

  c2d. clearRect( 0, 0, Canvas. width, Canvas. height);

  drawNotes();

  lastNoteLoc+= noteDim. speedY;

  if( lastNoteLoc>= gameDim. vCount* noteDim. l)
  {
    check();

    removeNote();

    playerLoc--;

    lastNoteLoc= (gameDim. vCount- 1)* noteDim. l;
  }

  setTimeout( animate, animationSpeed);
}


function keyPress( event)
{
  var key= event. which;

  var notePress= -1;

  if( key== 65 || key== 37) notePress= 0;
  if( key== 83 || key== 40) notePress= 1;
  if( key== 68 || key== 39) notePress= 2;

  if( notePress== -1|| playerLoc> gameDim. vCount) return;

  if( noteArr[ playerLoc][ notePress]== 0)
  {
    _end= true;
    return;
  }

  noteArr[ playerLoc][ notePress]= 2;

  score++;

  if( noteDim. speedY< noteDim. maxSpeedY) noteDim. speedY+= noteDim. accY;

  if( noteDim. accY> noteDim. minAccY) noteDim. accY-= noteDim. accSqY;

  for( var i= 0; i< gameDim. hCount; i++) if( noteArr[ playerLoc][ i]== 1) return;

  playerLoc++;
}


function drawMe()
{
  mc2d. font= "14px Verdana";
  mc2d. textAlign= "center";
  mc2d. fontColor= "#1d232a";
  mc2d. fillText( "--CRAZY NOTES--", meCanvas. width/ 2, 15);
  mc2d. fillText( "Vinay Goel,", meCanvas. width/ 2, 30);
  mc2d. fillText( "vinaygoel214@gmail.com", meCanvas. width/ 2, 45);

  mc2d. textAlign= "left";
  mc2d. fillText( "CONTROLS--", 15, 20);
  mc2d. fillText( "ARROW KEYS :)", 15, 40);

  mc2d. textAlign= "right";
  mc2d. fillText( "--SCORE", meCanvas. width- 15, 20);
  mc2d. fillText( score, meCanvas. width- 15, 40);
}


document. addEventListener( "keydown", keyPress);

_init();

animate();
