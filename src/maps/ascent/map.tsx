import * as React from "react";
import { useState } from "react";

import type { BottomleftImageVideo, LineupDirection } from "../../App";
import {
  type Agent,
  imageMap,
  type Lineup,
  type MapArea,
  Utility,
} from "../../types";
import lineups from "./lineups";

const areasFrom = [
  {
    title: "A TreeHouse Box",
    x: 556,
    y: 218,
    width: 7,
    height: 7,
  },
  {
    title: "A Main Box",
    x: 543,
    y: 448,
    width: 7,
    height: 7,
  },
  {
    title: "A Tree Tree",
    x: 506,
    y: 288,
    width: 7,
    height: 7,
  },
  {
    title: "A CT Corner",
    x: 601,
    y: 102,
    width: 7,
    height: 7,
  },
  {
    title: "A Mid Boxes",
    x: 509,
    y: 384,
    width: 7,
    height: 7,
  },
  {
    title: "B Main Box",
    x: 134,
    y: 420,
    width: 11,
    height: 11,
  },
  {
    title: "CT Triple Barrels",
    x: 447,
    y: 161,
    width: 7,
    height: 7,
  },
] as const; // Ideally we would ensure this satisfies MapArea[] but that is extremely hard to do

const areasTo = [
  {
    title: "A Dice",
    x: 674,
    y: 231,
    width: 32,
    height: 28,
  },
  {
    title: "A Wine",
    x: 721,
    y: 368,
    width: 39,
    height: 34,
  },
  {
    title: "A Generator",
    x: 610,
    y: 238,
    width: 24,
    height: 24,
  },
  {
    title: "A Outside Gen",
    x: 626,
    y: 264,
    width: 24,
    height: 24,
  },
  {
    title: "B Default Box",
    x: 98,
    y: 208,
    width: 21,
    height: 22,
  },
  {
    title: "B Far Box",
    x: 112,
    y: 156,
    width: 21,
    height: 21,
  },
  {
    title: "B Opposite Lane",
    x: 175,
    y: 156,
    width: 29,
    height: 23,
  },
] as const; // Ideally we would ensure this satisfies MapArea[] but that is extremely hard to do

export type FromAreaTitles = (typeof areasFrom)[number]["title"];
export type ToAreaTitles = (typeof areasTo)[number]["title"];
export type AllAreaTitles = FromAreaTitles | ToAreaTitles;

const SvgComponent = ({
  agent,
  util,
  lineupDirection,
  setBottomleftImageVideoImages,
}: {
  agent: Agent;
  util: Utility;
  lineupDirection: LineupDirection;
  setBottomleftImageVideoImages: ReturnType<
    typeof useState<BottomleftImageVideo>
  >[1];
}) => {
  const [primaryTo, setPrimaryTo] = useState<MapArea<ToAreaTitles> | null>(
    null
  );
  const [primaryFrom, setPrimaryFrom] =
    useState<MapArea<FromAreaTitles> | null>(null);

  function getAreaOpacity(thisArea: MapArea<string>): number {
    const areaIsUsedInLineup = lineups.some((lineup) => {
      if (
        lineup.agent === agent &&
        lineup.util === util &&
        (lineup.fromTitle === thisArea.title ||
          lineup.toTitle === thisArea.title)
      ) {
        return true;
      }
      return false;
    });
    if (!areaIsUsedInLineup) return 0;

    const isPrimaryArea =
      primaryTo?.title === thisArea.title ||
      primaryFrom?.title === thisArea.title;
    if (isPrimaryArea) return 1;

    const areaIsFrom = areasFrom.some((area) => area.title === thisArea.title);
    const areaIsTo = areasTo.some((area) => area.title === thisArea.title);

    if (
      areaIsTo &&
      primaryFrom &&
      !primaryTo &&
      lineupDirection === "startToDestination"
    ) {
      const usedInLineup = lineups.some((lineup) => {
        if (
          primaryFrom.title === lineup.fromTitle &&
          lineup.toTitle === thisArea.title
        ) {
          return true;
        }
        return false;
      });
      if (usedInLineup) return 0.5;
    }

    if (
      areaIsFrom &&
      primaryTo &&
      !primaryFrom &&
      lineupDirection === "destinationToStart"
    ) {
      const usedInLineup = lineups.some((lineup) => {
        if (
          primaryTo.title === lineup.toTitle &&
          lineup.fromTitle === thisArea.title
        ) {
          return true;
        }
        return false;
      });
      if (usedInLineup) return 0.5;
    }

    if (!primaryTo && !primaryFrom) {
      if (lineupDirection === "destinationToStart" && areaIsTo) return 0.5;
      if (lineupDirection === "startToDestination" && areaIsFrom) return 0.5;
    }
    return 0;
  }

  function resetPrimaryAreas() {
    setPrimaryFrom(null);
    setPrimaryTo(null);
  }

  function getCurrentLineup({
    newAreaTo,
    newAreaFrom,
  }: {
    newAreaTo?: MapArea<ToAreaTitles>;
    newAreaFrom?: MapArea<FromAreaTitles>;
  }): Lineup<FromAreaTitles, ToAreaTitles> | null {
    const lineup = lineups.find(
      (lineup) =>
        lineup.fromTitle === (newAreaFrom?.title ?? primaryFrom?.title) &&
        lineup.toTitle === (newAreaTo?.title ?? primaryTo?.title)
    );
    return lineup ?? null;
  }

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={900}
      height={900}
      viewBox="0 0 800 800"
      fill="none"
    >
      <g id="Ascent">
        <g id="Whole Map Gray">
          <path
            id="Subtract"
            fillRule="evenodd"
            clipRule="evenodd"
            d="M68.2725 166.465L20.1198 166.422V250.841L68.4583 250.872L68.3208 239.024H72.8973V288.128H227.403V292.584H138.387V382.71H144.358V386.123L133.655 386.122V500.726H221.291L221.328 693.923L274.621 692.968V781.159H309.067L326.843 760.256V754.513H358.807V672.354H494.356L494.377 656.931L543.671 656.816V597.584H531.192L531.005 563.652H605.411L605.064 407.941L585.179 408.343V402.505H703.333V391.621H721.063V402.557H759.997V367.543H688.744V339.897H733.171V172.777H607.643V102.048L519.918 101.9L519.966 92.8424L483.52 92.8817L483.513 102.977L477.167 102.935V18.3751H370.676V103.899H216.748V150.034H227.226V155.971H73.3343V177.682H68.2725V166.465ZM335.996 271.313H292.368L291.799 231.42L287.367 231.414L287.131 262.573L268.796 262.757V287.657H252.605V292.86H275.424V350.647H210.545V333.643H174.777V382.469H167.924V386.477H228.919V402.181H262.448L262.448 386.157H325.634V407.323H328.739V292.911H357.675V240.093H355.731V252.251L335.996 271.313ZM258.218 426.266L280.817 425.966V448.82H326.156V426.398H329.197V454.198H394.405L405.676 465.085V552.454H500.878V597.476H405.873V575.106H340.909V580.658H258.218V426.266ZM488.711 373.468H460.431L460.548 511.55H543.219V408.584H562.97V402.496H554.46V350.821H585.564V367.518H658.779V339.759H602.685V322.605H595.693V334.484H525.264V345.257H536.574V391.565H488.711V373.468ZM442.488 149.919H477.636V133.824H483.499V236.396H530.627V281.82H548.104V287.377H494.409V334.326H507.192V345.41L424.42 345.447V292.705H400.236V259.646H430.377V218.016H407.34L395.639 206.713V195.427L405.93 185.486H454.792V152.1H442.488V149.919ZM578.851 132.648H519.504V207.497L551.38 207.431V203.976H536.958V172.762H578.851V132.648ZM564.072 204.196H577.888L578.023 201.846H655.112V206.594H613.516V281.589H602.34V298.808H595.909V287.244H567.404V282.179L585.089 282.095V241.959L572.609 225.287L572.762 218.461L572.609 207.19H564.072L564.072 204.196ZM304.888 132.961L281.542 132.796V150.096H252.547V155.563H258.144V188.305H287.291V212.855H292.066V200.994H355.967V213.475H357.902V205.867H370.515V152.344H417.231V150.063H304.888V132.961Z"
            fill="#BEBFBE"
          />
          <path
            id="rect2064"
            d="M424.335 340.029H388.888V341.758H424.335V340.029Z"
            fill="#3B3B3B"
          />
          <path
            id="rect2067"
            d="M449.149 345.302H439.328V356.398H449.149V345.302Z"
            fill="#808080"
          />
          <path
            id="path4843"
            d="M315.534 634.948C320.169 634.948 323.927 630.965 323.927 626.053C323.927 621.14 320.169 617.157 315.534 617.157C310.899 617.157 307.141 621.14 307.141 626.053C307.141 630.965 310.899 634.948 315.534 634.948Z"
            fill="#B2B2B2"
          />
          <path
            id="rect4845"
            d="M247.193 679.775L253.038 674.006H260.793L266.765 679.775V686.681L261.416 693.003L253.748 693.014L247.193 686.682V679.775Z"
            fill="#8E8E8E"
          />
          <path
            id="rect4848"
            d="M142.851 454.309H133.546V462.439H142.851V454.309Z"
            fill="#B2B2B2"
          />
          <path
            id="rect1168"
            d="M356.28 334.48H344.754V339.684H356.28V334.48Z"
            fill="#B2B2B2"
          />
        </g>
        <g id="Site Area ">
          <path
            id="rect1956"
            d="M732.867 206.594H613.516V276.424H732.867V206.594Z"
            fill="#A5A389"
          />
          <path
            id="rect1958"
            d="M174.726 155.971H73.3344V261.741H174.726V155.971Z"
            fill="#A5A389"
          />
        </g>
        <g id="Boxes - Filled in">
          <path
            id="rect1998"
            d="M733.284 316.761H708.99V339.678H733.284V316.761Z"
            fill="#666666"
          />
          <path
            id="rect2000"
            d="M733.217 264.385H720.711V276.424H733.217V264.385Z"
            fill="#666666"
          />
          <path
            id="rect2002"
            d="M643.507 230.579H631.434V264.238H643.507V230.579Z"
            fill="#4D4D4D"
          />
          <path
            id="rect2004"
            d="M690.437 235.799H679.474V246.206H690.437V235.799Z"
            fill="#666666"
          />
          <path
            id="rect2006"
            d="M701.767 239.032H691.183V249.301H701.767V239.032Z"
            fill="#666666"
          />
          <path
            id="rect2008"
            d="M732.944 206.594H720.414V217.929H732.944V206.594Z"
            fill="#808080"
          />
          <path
            id="rect2010"
            d="M732.743 189.985H720.45V200.317H732.743V189.985Z"
            fill="#4D4D4D"
          />
          <path
            id="rect2012"
            d="M577.581 273.556L584.877 277.625L584.447 281.21L579.563 281.995L574.293 279.056L577.581 273.556Z"
            fill="#999999"
          />
          <path
            id="rect2015"
            d="M519.504 195.396H507.336V207.497H519.504V195.396Z"
            fill="#808080"
          />
          <path
            id="rect2017"
            d="M572.609 218.461H564.387V225.287H572.609V218.461Z"
            fill="#999999"
          />
          <path
            id="rect2023"
            d="M188.955 209.31L193.281 203.164L195.105 202.496L197.376 203.813L200.12 209.31V240.237H188.955V209.31Z"
            fill="#999999"
          />
          <path
            id="rect2026"
            d="M174.726 252.07H163.194V261.741H174.726V252.07Z"
            fill="#808080"
          />
          <path
            id="rect2028"
            d="M144.149 155.662H132.8V166.043H144.149V155.662Z"
            fill="#808080"
          />
          <path
            id="rect2030"
            d="M115.709 208.414L126.846 208.255V213.962L128.5 218L129.153 219.58V229.909H118.506V221.092L115.684 216.307L115.709 208.414Z"
            fill="#808080"
          />
          <path
            id="rect2033"
            d="M286.939 246.025H268.61V248.677H286.939V246.025Z"
            fill="#808080"
          />
          <path
            id="rect2035"
            d="M156.478 430.895H133.664V454.309H156.478V430.895Z"
            fill="#808080"
          />
          <path
            id="rect2037"
            d="M417.142 510.827H405.696V522.693H417.142V510.827Z"
            fill="#808080"
          />
          <path
            id="rect2039"
            d="M471.309 511.717H460.431V522.605H471.309V511.717Z"
            fill="#808080"
          />
          <path
            id="rect2041"
            d="M533.583 535.936H530.961V563.559H533.583V535.936Z"
            fill="#808080"
          />
          <path
            id="rect2043"
            d="M593.341 494.365H587.458V499.962H593.341V494.365Z"
            fill="#999999"
          />
          <path
            id="rect2045"
            d="M605.396 488.973H593.341V500.067H605.396V488.973Z"
            fill="#808080"
          />
          <path
            id="rect2047"
            d="M554.399 455.42H543.218V465.309H554.399V455.42Z"
            fill="#4D4D4D"
          />
          <path
            id="rect2053"
            d="M62.1871 243.554H68.4583V250.872L57.5367 250.858L57.5494 248.376L62.1871 243.554Z"
            fill="#3B3B3B"
          />
          <path
            id="rect2058"
            d="M152.538 261.791L174.726 261.741V179.216H203.758V181.404H176.483V261.972L203.579 261.972L203.579 264.712H152.538V261.791Z"
            fill="#4D4D4D"
          />
          <path
            id="path2085"
            d="M500.38 298.301C503.631 298.301 506.266 295.903 506.266 292.944C506.266 289.985 503.631 287.587 500.38 287.587C497.129 287.587 494.494 289.985 494.494 292.944C494.494 295.903 497.129 298.301 500.38 298.301Z"
            fill="#4D4D4D"
            stroke="black"
            strokeWidth={0.781731}
          />
          <path
            id="path2073"
            d="M498.627 334.321C500.881 334.321 502.709 332.544 502.709 330.352C502.709 328.16 500.881 326.383 498.627 326.383C496.373 326.383 494.545 328.16 494.545 330.352C494.545 332.544 496.373 334.321 498.627 334.321Z"
            fill="#4D4D4D"
            stroke="black"
            strokeWidth={0.754908}
          />
          <path
            id="path4705"
            d="M543.047 213.127C544.572 213.127 545.808 211.905 545.808 210.398C545.808 208.891 544.572 207.669 543.047 207.669C541.522 207.669 540.286 208.891 540.286 210.398C540.286 211.905 541.522 213.127 543.047 213.127Z"
            fill="#999999"
            stroke="black"
            strokeWidth={0.682836}
          />
          <path
            id="rect4709"
            d="M720.414 206.594H714.904V211.156H720.414V206.594Z"
            fill="#999999"
            stroke="black"
            strokeWidth={0.865512}
          />
          <path
            id="rect4711"
            d="M536.574 379.944H521.971V391.565H536.574V379.944Z"
            fill="#808080"
            stroke="black"
            strokeWidth={0.865512}
          />
          <path
            id="rect4713"
            d="M521.971 385.453H516.24V391.565H521.971V385.453Z"
            fill="#999999"
            stroke="black"
            strokeWidth={0.865512}
          />
          <path
            id="path4719"
            d="M322.205 392.682C324.124 392.682 325.68 391.207 325.68 389.388C325.68 387.569 324.124 386.094 322.205 386.094C320.285 386.094 318.729 387.569 318.729 389.388C318.729 391.207 320.285 392.682 322.205 392.682Z"
            fill="#4D4D4D"
            stroke="black"
            strokeWidth={0.921596}
          />
          <path
            id="rect4721"
            d="M162.985 292.684H149.378V306.345H162.985V292.684Z"
            fill="#808080"
            stroke="black"
            strokeWidth={1.28916}
          />
          <path
            id="rect4723"
            d="M162.985 306.345H156.336V312.403H162.985V306.345Z"
            fill="#999999"
            stroke="black"
            strokeWidth={1.19692}
          />
          <path
            id="rect4750"
            d="M268.796 276.523V287.657H256.062L268.796 276.523Z"
            fill="#3B3B3B"
          />
          <path
            id="rect4835"
            d="M521.508 621.083H512.761V629.326H521.508V621.083Z"
            fill="#999999"
          />
          <path
            id="rect4837"
            d="M438.827 619.869L449.832 613.476L452.995 621.385L441.99 627.778L438.827 619.869Z"
            fill="#999999"
          />
          <path
            id="rect4839"
            d="M415.969 613.202L427.024 609.89L428.839 619.789L417.784 623.102L415.969 613.202Z"
            fill="#999999"
          />
          <path
            id="path4860"
            d="M422.792 94.3296C425.606 94.3296 427.887 92.1853 427.887 89.5402C427.887 86.8951 425.606 84.7508 422.792 84.7508C419.977 84.7508 417.696 86.8951 417.696 89.5402C417.696 92.1853 419.977 94.3296 422.792 94.3296Z"
            fill="#999999"
          />
          <path
            id="rect4892"
            d="M224.747 142.91H216.748V149.981H224.747V142.91Z"
            fill="#808080"
          />
          <path
            id="rect4902"
            d="M418.211 249.725L426.071 249.698L426.086 245.513L430.451 245.437V259.722H418.211V249.725Z"
            fill="#999999"
          />
          <path
            id="rect4905"
            d="M382.038 442.195H369.821V453.827H382.038V442.195Z"
            fill="#808080"
          />
          <path
            id="rect4907"
            d="M494.333 656.931H472.841V672.239H494.333V656.931Z"
            fill="#808080"
          />
          <path
            id="rect4909"
            d="M564.031 545.975H553.249V555.776H564.031V545.975Z"
            fill="#999999"
          />
          <path
            id="rect4911"
            d="M588.171 539.777H579.084V549.593H588.171V539.777Z"
            fill="#999999"
          />
          <path
            id="rect4917"
            d="M605.064 427.619H602.307V437.686H605.064V427.619Z"
            fill="#999999"
          />
          <path
            id="rect5140"
            d="M174.726 247.487H169.071V252.07H174.726V247.487Z"
            fill="#999999"
          />
          <path
            id="rect1158"
            d="M733.171 316.807H721.346V339.897H733.171V316.807Z"
            fill="#4D4D4D"
          />
          <path
            id="rect1166"
            d="M326.798 261.728H292.404V271.278H326.798V261.728Z"
            fill="#B2B2B2"
          />
          <path id="rect1170" d="M73 190H70V226H73V190Z" fill="#4D4D4D" />
          <path
            id="path1171"
            d="M581.875 282.214C583.456 282.214 584.738 280.892 584.738 279.262C584.738 277.631 583.456 276.31 581.875 276.31C580.293 276.31 579.011 277.631 579.011 279.262C579.011 280.892 580.293 282.214 581.875 282.214Z"
            fill="#808080"
          />
          <path
            id="rect1174"
            d="M605.064 408.366H593.448V419.552H605.064V408.366Z"
            fill="#666666"
          />
          <path
            id="rect1176"
            d="M605.367 408.183H597.749V415.899H605.367V408.183Z"
            fill="#4D4D4D"
          />
          <path
            id="rect1182"
            d="M605.065 402.307H585.179V407.882H605.065V402.307Z"
            fill="#4D4D4D"
          />
          <path
            id="rect1184"
            d="M562.97 402.496H554.46V408.584H562.97V402.496Z"
            fill="#4D4D4D"
          />
          <path
            id="path4850"
            d="M375.921 420.912C378.628 420.912 380.822 418.73 380.822 416.039C380.822 413.349 378.628 411.167 375.921 411.167C373.214 411.167 371.02 413.349 371.02 416.039C371.02 418.73 373.214 420.912 375.921 420.912Z"
            fill="#999999"
          />
          <path
            id="rect1218"
            d="M357.362 341.748H346.564V352.524H357.362V341.748Z"
            fill="#4D4D4D"
          />
          <path
            id="rect1220"
            d="M340.023 328.955H328.653V339.746H340.023V328.955Z"
            fill="#808080"
          />
          <path
            id="rect1222"
            d="M356.28 334.48H344.754V339.684H356.28V334.48Z"
            fill="#999999"
          />
          <path
            id="rect1224"
            d="M326.798 261.728H292.404V271.278H326.798V261.728Z"
            fill="#999999"
          />
          <path
            id="rect1226"
            d="M572.609 218.461H564.387V225.287H572.609V218.461Z"
            fill="#999999"
          />
          <path
            id="rect1228"
            d="M142.851 454.309H133.664V462.439H142.851V454.309Z"
            fill="#999999"
          />
        </g>
        <g id="A / B ">
          <text
            id="text1331-9"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="Inter"
            fontSize={32}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={650.044} y={260.597}>
              {" "}
              {"A"}{" "}
            </tspan>
          </text>
          <text
            id="text1327"
            fill="black"
            xmlSpace="preserve"
            style={{
              whiteSpace: "pre",
            }}
            fontFamily="Inter"
            fontSize={33.3037}
            fontWeight="bold"
            letterSpacing="0em"
          >
            <tspan x={90.793} y={199.548}>
              {" "}
              {"B"}{" "}
            </tspan>
          </text>
        </g>
        <g id="Outlines">
          <path
            id="path66"
            d="M221.329 692.968H274.621V781.159H309.067L326.843 760.256V754.513H358.807L358.855 672.349L494.355 672.355V656.816L543.671 656.816V597.584H531.192L531.005 563.652L605.412 563.65L605.065 407.94L585.179 407.882L585.179 402.505H703.333V391.621H721.063V402.557H759.997V367.543H688.744V339.897H733.171V172.777H607.643V102.048L519.918 101.9L519.838 92.5233L483.52 92.8815L483.513 102.977L477.167 102.935V18.375H370.676V103.899L216.762 103.499L216.748 150.034H227.226V155.971H73.3344V177.682H68.2725V166.465L20.1169 166.231L20.1198 250.841L68.4583 250.872L68.3208 239.024H72.8973V288.128H227.403V292.584H138.387V382.71H144.358V386.123L133.655 386.123V500.726L221.328 500.858V693.923"
            stroke="black"
            strokeWidth={1.00548}
          />
          <path
            id="path96"
            d="M200.12 209.31C200.12 209.31 198.17 202.409 195.118 202.248C192.065 202.086 188.939 209.196 188.939 209.196L188.955 240.237L200.168 240.231L200.12 209.31Z"
            stroke="black"
            strokeWidth={0.999999}
          />
          <path
            id="path114"
            d="M118.382 220.885L118.506 221.092V229.909H129.153L129.153 219.58L128.5 218L126.846 213.962V208.255L115.709 208.414L115.684 216.307L118.382 220.885Z"
            stroke="black"
            strokeWidth={0.999999}
          />
          <path
            id="path118"
            d="M70 190V226H73V190.063L70 190Z"
            stroke="black"
            strokeWidth={0.999999}
          />
          <path
            id="path120"
            d="M72.9027 261.741H174.726V179.216H203.758V181.404H176.483V261.972H203.579V264.712H72.8445"
            stroke="black"
          />
          <path
            id="path122"
            d="M152.538 261.791V264.759"
            stroke="black"
            strokeWidth={0.999999}
          />
          <path
            id="path124"
            d="M163.194 261.449V252.07H174.543"
            stroke="black"
            strokeWidth={0.999999}
          />
          <path
            id="path126"
            d="M275.066 205.998H258.009V245.961H287.105"
            stroke="black"
            strokeWidth={0.999999}
          />
          <path
            id="path128"
            d="M268.61 246.025V248.677H286.939"
            stroke="black"
            strokeWidth={0.999999}
          />
          <path
            id="path134"
            d="M262.448 386.157H325.634V407.323H328.739V292.911H357.675V240.093H355.731V252.251L335.996 271.313H292.368L291.799 231.419L287.367 231.412L287.131 262.571L268.796 262.755V287.656H252.605V292.859H275.424V350.645H210.545V333.642H174.777V382.468H167.924V386.475H228.919V402.18L262.448 402.18L262.448 386.157Z"
            stroke="black"
            strokeWidth={0.999999}
          />
          <path
            id="path136"
            d="M133.546 454.309H156.478V430.895H133.664"
            stroke="black"
            strokeWidth={0.999999}
          />
          <path
            id="path138"
            d="M315.524 635.044C320.465 635.044 324.471 631.008 324.471 626.031C324.471 621.053 320.465 617.017 315.524 617.017C310.583 617.017 306.577 621.053 306.577 626.031C306.577 631.008 310.583 635.044 315.524 635.044Z"
            stroke="black"
            strokeWidth={1.13386}
          />
          <path
            id="path965"
            d="M253.748 693.012L247.193 686.681V679.652L253.038 674.006H260.793L266.765 679.775V687.425L261.416 693.004"
            stroke="black"
            strokeWidth={0.999999}
          />
          <path
            id="path977"
            d="M472.841 672.439V656.931L494.355 656.816"
            stroke="black"
            strokeWidth={0.999999}
          />
          <path
            id="path981"
            d="M605.396 488.973H593.341V494.365H587.458V499.962H605.319"
            stroke="black"
            strokeWidth={0.999999}
          />
          <path
            id="path983"
            d="M593.341 494.365V500.067"
            stroke="black"
            strokeWidth={0.999999}
          />
          <path
            id="path985"
            d="M460.548 511.55H543.219V408.584H562.97V402.496H554.46V350.821H585.564V367.518H658.779V339.759H602.685V322.605H595.693V334.484H525.264V345.257H536.574V391.565H488.711V373.468H460.431V511.674"
            stroke="black"
            strokeWidth={0.999999}
          />
          <path
            id="path997"
            d="M460.431 511.674V522.605H471.309V511.717"
            stroke="black"
            strokeWidth={0.999999}
          />
          <path
            id="path1003"
            d="M287.291 212.855H292.066V200.994H355.967V213.475H357.902V205.867H370.515V152.344H417.231V150.063H304.888V132.961L281.542 132.796V150.096H252.547V155.563H258.144V188.305H287.291V212.855Z"
            stroke="black"
            strokeWidth={0.999999}
          />
          <path
            id="path1007"
            d="M593.448 408.366V419.552H605.064"
            stroke="black"
            strokeWidth={0.999999}
          />
          <path
            id="path1009"
            d="M597.749 408.183L597.767 415.899H605.367"
            stroke="black"
            strokeWidth={0.999999}
          />
          <path
            id="path1011"
            d="M543.327 455.42H554.399V465.309H543.218"
            stroke="black"
            strokeWidth={0.999999}
          />
          <path
            id="path1015"
            d="M405.676 552.454V465.085L394.405 454.198H329.197V426.398H326.156V448.82H280.817V425.966L258.218 426.266V580.658H340.909V575.106H405.873V597.476H500.878V552.454H405.676Z"
            stroke="black"
            strokeWidth={0.999999}
          />
          <path
            id="path1019"
            d="M405.65 522.693H417.141V510.827H405.696"
            stroke="black"
            strokeWidth={0.999999}
          />
          <path
            id="path1021"
            d="M417.141 510.827H436.877V430.875H406.216"
            stroke="black"
            strokeWidth={0.999999}
          />
          <path
            id="path1023"
            d="M405.701 402.58H436.624V345.41H507.192V334.326H494.409V287.377H548.104V281.82H530.627V236.396H483.499V133.824H477.636V149.919H442.488V152.1H454.792V185.486H405.93L395.639 195.427V206.713L407.339 218.016H430.376V259.646H400.236V292.705H424.42V345.447H436.664"
            stroke="black"
            strokeWidth={0.999999}
          />
          <path
            id="path1031"
            d="M330.417 341.785C319.399 341.821 374.49 341.772 363.472 341.786"
            stroke="black"
            strokeWidth={0.973928}
          />
          <path
            id="path1033"
            d="M388.411 341.758L364.405 341.785L363.392 341.786"
            stroke="black"
            strokeWidth={0.999999}
            strokeDasharray="2 1"
          />
          <path
            id="path1035"
            d="M363.992 339.989L388.447 339.975"
            stroke="black"
            strokeWidth={0.999999}
            strokeDasharray="2 1"
          />
          <path
            id="path1037"
            d="M363.992 339.989H328.962"
            stroke="black"
            strokeWidth={0.999999}
          />
          <path
            id="path1039"
            d="M328.653 328.955H340.023V339.746"
            stroke="black"
            strokeWidth={0.999999}
          />
          <g id="path1041">
            <path d="M344.754 339.774V334.48H356.28V339.684" fill="#999999" />
            <path
              d="M344.754 339.774V334.48H356.28V339.684"
              stroke="black"
              strokeWidth={0.999999}
            />
          </g>
          <path
            id="path1043"
            d="M388.447 339.975H424.26"
            stroke="black"
            strokeWidth={0.999999}
          />
          <path
            id="path1045"
            d="M388.411 341.758H424.335"
            stroke="black"
            strokeWidth={0.999999}
          />
          <path
            id="path1047"
            d="M388.888 340.029V341.87"
            stroke="black"
            strokeWidth={0.999999}
          />
          <path
            id="path1049"
            d="M542.316 281.784V247.974"
            stroke="black"
            strokeWidth={0.999999}
          />
          <path
            id="path1051"
            d="M573.324 282.095V247.584"
            stroke="black"
            strokeWidth={0.999999}
          />
          <path
            id="path1053"
            d="M585.175 277.625L577.673 273.556L574.293 279.056L579.711 281.995"
            stroke="black"
            strokeWidth={0.999999}
          />
          <path
            id="path1055"
            d="M573.324 282.095H585.089V241.959L572.61 225.287"
            stroke="black"
            strokeWidth={0.999999}
          />
          <path
            id="path1057"
            d="M572.61 225.287V207.19H564.072V204.196H577.888V199.64"
            stroke="black"
            strokeWidth={0.999999}
          />
          <path
            id="path1059"
            d="M578.023 201.846H655.112V206.594H613.517V281.589H602.341V298.808H595.909V287.244H567.404V282.179L573.324 282.096"
            stroke="black"
            strokeWidth={0.999999}
          />
          <path
            id="path1061"
            d="M581.766 282.074C583.589 282.074 585.067 280.788 585.067 279.201C585.067 277.614 583.589 276.327 581.766 276.327C579.942 276.327 578.464 277.614 578.464 279.201C578.464 280.788 579.942 282.074 581.766 282.074Z"
            stroke="black"
            strokeWidth={1.04685}
          />
          <path
            id="path1063"
            d="M572.61 225.287H564.387V218.461H572.762"
            stroke="black"
            strokeWidth={0.999999}
          />
          <path
            id="path1065"
            d="M564.387 218.461H546.055V207.431M546.055 207.431H551.38V203.976H536.959V172.762H578.852V132.648H519.504L518.937 207.431H546.055Z"
            stroke="black"
            strokeWidth={0.999999}
          />
          <path
            id="path1067"
            d="M518.937 207.431L507.336 207.497L507.336 195.396H519.504"
            stroke="black"
            strokeWidth={0.999999}
          />
          <path
            id="path1425"
            d="M733.217 264.385H720.711V276.424H732.868"
            stroke="black"
            strokeWidth={0.999999}
          />
          <path
            id="path1429"
            d="M733.284 316.761H708.99V339.678"
            stroke="black"
            strokeWidth={0.999999}
          />
          <path
            id="path1433"
            d="M721.346 316.807V339.665"
            stroke="black"
            strokeWidth={0.999999}
          />
          <path
            id="path1435"
            d="M57.5367 250.857L57.5494 248.376L62.1871 243.554L68.221 243.52"
            stroke="black"
            strokeWidth={0.999999}
          />
          <path
            id="path1437"
            d="M422.92 94.3775C425.762 94.3775 428.065 92.1393 428.065 89.3784C428.065 86.6175 425.762 84.3793 422.92 84.3793C420.079 84.3793 417.775 86.6175 417.775 89.3784C417.775 92.1393 420.079 94.3775 422.92 94.3775Z"
            stroke="black"
            strokeWidth={1.17182}
          />
          <g id="path1099">
            <path d="M655.574 206.597L694.292 206.278Z" fill="black" />
            <path
              d="M655.574 206.597L694.292 206.278"
              stroke="black"
              strokeWidth={1.00157}
              strokeDasharray="4.01 1"
            />
          </g>
          <path
            id="path1085"
            d="M132.8 155.905V166.043H144.149V155.662"
            stroke="black"
            strokeWidth={0.999999}
          />
          <path
            id="path1087"
            d="M732.743 189.985H720.45V200.317H732.708"
            stroke="black"
            strokeWidth={0.999999}
          />
          <path
            id="path1091"
            d="M631.434 230.58V264.238H643.507V230.662L631.434 230.58Z"
            stroke="black"
            strokeWidth={0.999999}
          />
          <path
            id="path1093"
            d="M679.474 235.799L679.506 246.206H690.437V235.84L679.474 235.799Z"
            stroke="black"
            strokeWidth={0.999999}
          />
          <path
            id="path1095"
            d="M690.487 239.032H701.767V249.301H691.183V238.927"
            stroke="black"
            strokeWidth={0.999999}
          />
          <path
            id="path1097"
            d="M732.981 217.929H720.414L720.386 206.424L732.868 206.594"
            stroke="black"
            strokeWidth={0.999999}
          />
          <path
            id="path1101"
            d="M439.328 345.159V356.398H449.149V345.302"
            stroke="black"
            strokeWidth={0.999999}
          />
          <path
            id="path1103"
            d="M382.038 453.827V442.195H369.821V453.801"
            stroke="black"
            strokeWidth={0.999999}
          />
          <path
            id="path1107"
            d="M375.85 420.889C378.595 420.889 380.82 418.694 380.82 415.986C380.82 413.277 378.595 411.082 375.85 411.082C373.104 411.082 370.879 413.277 370.879 415.986C370.879 418.694 373.104 420.889 375.85 420.889Z"
            stroke="black"
            strokeWidth={0.977295}
          />
          <path
            id="path1109"
            d="M346.564 341.431V352.524H357.362V341.748"
            stroke="black"
            strokeWidth={0.999999}
          />
          <path
            id="path1920"
            d="M531.005 563.652L530.961 535.936L533.583 535.905V563.559"
            stroke="black"
            strokeWidth={0.999999}
          />
          <path
            id="path1924"
            d="M304.888 132.961H371.991"
            stroke="black"
            strokeWidth={0.999999}
          />
          <path
            id="path2132"
            d="M733.231 206.2L694.292 206.278"
            stroke="black"
            strokeWidth={0.999999}
          />
          <path
            id="path4743"
            d="M256.454 287.725L268.744 276.804"
            stroke="black"
            strokeWidth={0.999999}
          />
          <path
            id="rect4753"
            d="M174.726 247.487H169.071V252.07H174.726V247.487Z"
            stroke="black"
            strokeWidth={0.865512}
          />
          <path
            id="rect4755"
            d="M224.747 142.91H216.748V149.981H224.747V142.91Z"
            stroke="black"
            strokeWidth={0.865512}
          />
          <path
            id="path4757"
            d="M220.104 150.034C221.957 150.034 223.459 148.733 223.459 147.129C223.459 145.525 221.957 144.224 220.104 144.224C218.251 144.224 216.748 145.525 216.748 147.129C216.748 148.733 218.251 150.034 220.104 150.034Z"
            stroke="black"
            strokeWidth={0.865512}
          />
          <path
            id="path4759"
            d="M449 154.577C449 155.268 448.814 155.85 448.338 156.302C447.862 156.754 447.356 157 446.63 157C445.178 157 444 155.881 444 154.5C444 153.119 445.178 152 446.63 152C447.446 152 447.999 152.345 448.482 152.899C448.859 153.331 449 153.971 449 154.577Z"
            fill="#808080"
            stroke="black"
            strokeWidth={1.10374}
          />
          <path
            id="path4763"
            d="M451.5 161C452.881 161 454 159.881 454 158.5C454 157.119 452.881 156 451.5 156C450.119 156 449 157.119 449 158.5C449 159.881 450.119 161 451.5 161Z"
            fill="#808080"
            stroke="black"
            strokeWidth={1.20395}
          />
          <path
            id="rect4765"
            d="M418.213 249.697H426.071L426.086 245.512L430.451 245.436V259.72H418.211L418.213 249.697Z"
            stroke="black"
            strokeWidth={0.703612}
          />
          <path
            id="rect4773"
            d="M326.798 261.728H292.404V271.278H326.798V261.728Z"
            stroke="black"
            strokeWidth={0.943332}
          />
          <path
            id="rect4777"
            d="M427.024 609.89L415.969 613.202L417.784 623.102L428.839 619.789L427.024 609.89Z"
            stroke="black"
            strokeWidth={0.731271}
          />
          <path
            id="rect4810"
            d="M521.508 621.083H512.762V629.326H521.508V621.083Z"
            stroke="black"
            strokeWidth={0.865512}
          />
          <path
            id="rect4794"
            d="M449.832 613.476L438.827 619.869L441.99 627.778L452.995 621.385L449.832 613.476Z"
            stroke="black"
            strokeWidth={0.687292}
          />
          <path
            id="rect4829"
            d="M564.031 545.975H553.249V555.776H564.031V545.975Z"
            stroke="black"
            strokeWidth={0.865512}
          />
          <path
            id="rect4831"
            d="M588.171 539.777H579.084V549.593H588.171V539.777Z"
            stroke="black"
            strokeWidth={0.865512}
          />
          <path
            id="rect4913"
            d="M605.064 427.619H602.307V437.686H605.064V427.619Z"
            fill="#999999"
            stroke="black"
            strokeWidth={0.865512}
          />
          <path
            id="path1178"
            d="M554.461 402.496V408.576"
            stroke="black"
            strokeWidth={0.999999}
          />
          <path
            id="path1180"
            d="M605.065 407.94V402.307"
            stroke="black"
            strokeWidth={0.999999}
          />
          <path
            id="path1216"
            d="M363.992 339.989V341.925"
            stroke="black"
            strokeWidth={0.999999}
          />
          <path
            id="path4763_2"
            d="M452 158C453.657 158 455 156.657 455 155C455 153.343 453.657 152 452 152C450.343 152 449 153.343 449 155C449 156.657 450.343 158 452 158Z"
            fill="#808080"
            stroke="black"
            strokeWidth={1.20395}
          />
        </g>

        {areasFrom.map((areaFrom) => {
          return (
            <>
              <image
                key={"from " + areaFrom.title}
                className="cursor-pointer duration-1000"
                x={areaFrom.x - 6} // todo fix
                y={areaFrom.y - 6}
                width={areaFrom.width + 12}
                height={areaFrom.height + 12}
                opacity={getAreaOpacity(areaFrom)}
                pointerEvents={getAreaOpacity(areaFrom) === 0 ? "none" : "auto"}
                href={imageMap[agent]}
                onClick={() => {
                  const alreadyActive = areaFrom.title === primaryFrom?.title;
                  if (alreadyActive) {
                    setPrimaryFrom(null);
                    setBottomleftImageVideoImages(null);

                    if (lineupDirection === "startToDestination" && primaryFrom)
                      setPrimaryTo(null);

                    return;
                  }

                  setPrimaryFrom(areaFrom);

                  const currentLineup = getCurrentLineup({
                    newAreaFrom: areaFrom,
                  });
                  if (!currentLineup) return;

                  setBottomleftImageVideoImages({
                    notes: currentLineup.notes,
                    sources: currentLineup.imageSources,
                  });
                }}
              ></image>
            </>
          );
        })}
        {areasTo.map((areaTo) => {
          return (
            <>
              <image
                key={"to " + areaTo.title}
                className="cursor-pointer duration-1000"
                x={areaTo.x - 10}
                y={areaTo.y - 10}
                width={areaTo.width + 20}
                height={areaTo.height + 20}
                opacity={getAreaOpacity(areaTo)}
                pointerEvents={getAreaOpacity(areaTo) === 0 ? "none" : "auto"}
                href={imageMap[util]}
                onClick={() => {
                  const alreadyActive = areaTo.title === primaryTo?.title;
                  if (alreadyActive) {
                    setPrimaryTo(null);
                    setBottomleftImageVideoImages(null);

                    if (lineupDirection === "destinationToStart" && primaryTo)
                      setPrimaryFrom(null);

                    return;
                  }

                  setPrimaryTo(areaTo);

                  const currentLineup = getCurrentLineup({ newAreaTo: areaTo });
                  if (!currentLineup) return;

                  setBottomleftImageVideoImages({
                    notes: currentLineup.notes,
                    sources: currentLineup.imageSources,
                  });
                }}
              ></image>
            </>
          );
        })}
      </g>
    </svg>
  );
};
export default SvgComponent;
