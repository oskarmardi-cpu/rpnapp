/*=========================================================
 RPN MANAGEMENT SYSTEM
 Utility.gs
 Enterprise Edition v3.0
=========================================================*/

const Utility = (() => {

  "use strict";

  /*=======================================================
    UUID
  =======================================================*/

  function uuid(){

    return Utilities.getUuid();

  }

  /*=======================================================
    NOW
  =======================================================*/

  function now(){

    return new Date();

  }

  /*=======================================================
    TODAY
  =======================================================*/

  function today(){

    return Utilities.formatDate(

      new Date(),

      CONFIG.APP.TIMEZONE,

      CONFIG.FORMAT.DATE

    );

  }

  /*=======================================================
    FORMAT DATE
  =======================================================*/

  function formatDate(

    date,

    format

  ){

    return Utilities.formatDate(

      new Date(date),

      CONFIG.APP.TIMEZONE,

      format ||

      CONFIG.FORMAT.DATETIME

    );

  }

  /*=======================================================
    SHA256
  =======================================================*/

  function sha256(text){

    const bytes = Utilities.computeDigest(

      Utilities.DigestAlgorithm.SHA_256,

      text

    );

    return bytes.map(function(b){

      const v =

        (b < 0 ? b + 256 : b)

        .toString(16);

      return (

        v.length === 1 ?

        "0"+v :

        v

      );

    }).join("");

  }

  /*=======================================================
    JSON
  =======================================================*/

  function json(data){

    return JSON.stringify(data);

  }

  /*=======================================================
    PARSE JSON
  =======================================================*/

  function parse(text){

    try{

      return JSON.parse(text);

    }

    catch(e){

      return {};

    }

  }

  /*=======================================================
    CLONE
  =======================================================*/

  function clone(object){

    return parse(

      json(object)

    );

  }

  /*=======================================================
    EMPTY
  =======================================================*/

  function isEmpty(value){

    return (

      value === null ||

      value === undefined ||

      value === ""

    );

  }

  /*=======================================================
    NUMBER
  =======================================================*/

  function number(value){

    return Number(value) || 0;

  }

  /*=======================================================
    BOOLEAN
  =======================================================*/

  function boolean(value){

    return String(value)

      .toUpperCase() === "TRUE";

  }

  /*=======================================================
    RANDOM
  =======================================================*/

  function random(

    min,

    max

  ){

    return Math.floor(

      Math.random() *

      (max-min+1)

    ) + min;

  }

  /*=======================================================
    LEFT PAD
  =======================================================*/

  function pad(

    value,

    length

  ){

    return String(value)

      .padStart(

        length,

        "0"

      );

  }

  /*=======================================================
    UPPER
  =======================================================*/

  function upper(text){

    return String(text)

      .toUpperCase()

      .trim();

  }

  /*=======================================================
    LOWER
  =======================================================*/

  function lower(text){

    return String(text)

      .toLowerCase()

      .trim();

  }

  /*=======================================================
    TITLE
  =======================================================*/

  function title(text){

    return String(text)

      .toLowerCase()

      .replace(/\b\w/g,

      c => c.toUpperCase());

  }

  /*=======================================================
    CURRENCY
  =======================================================*/

  function currency(value){

    return Utilities.formatString(

      "%,.0f",

      number(value)

    );

  }

  /*=======================================================
    PERCENT
  =======================================================*/

  function percent(

    value,

    digit

  ){

    digit = digit || 2;

    return (

      number(value)

      .toFixed(digit)

    ) + "%";

  }

  /*=======================================================
    DIFF DAYS
  =======================================================*/

  function diffDays(

    start,

    end

  ){

    const oneDay =

      1000*60*60*24;

    return Math.floor(

      (

        new Date(end) -

        new Date(start)

      ) / oneDay

    );

  }

  /*=======================================================
    PUBLIC
  =======================================================*/

  return {

    uuid,

    now,

    today,

    formatDate,

    sha256,

    json,

    parse,

    clone,

    isEmpty,

    number,

    boolean,

    random,

    pad,

    upper,

    lower,

    title,

    currency,

    percent,

    diffDays

  };

})();