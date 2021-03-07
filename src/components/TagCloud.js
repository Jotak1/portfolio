import React, { Component } from "react";
import TagCloud, { renderData } from "d3-tagcloud-for-react";

const colorarray = [
  "#8c5fc4",
  "#61b8ff",
  "#f7d286",
  "#e86971",
  "#76bb7f",
  "#5bbeca",
];
const data = [
  {
    label: "React",
    fontSize: 10,
    opacity: 8,
    color: "blue",
  },
  {
    label: "Angular",
    fontSize: 9,
    opacity: 9,
  },
  {
    label: "ECMAScript 6",
    fontSize: 4,
    opacity: 7,
  },
  {
    label: "Redux",
    fontSize: 4,
    opacity: 7,
  },
  {
    label: "HTML5",
    fontSize: 9,
    opacity: 9,
  },
  {
    label: "JSON APIs",
    fontSize: 9,
    opacity: 6,
  },
  {
    label: "JavaScript",
    fontSize: 9,
    opacity: 8,
  },
  {
    label: "CSS3",
    fontSize: 9,
    opacity: 9,
  },
  {
    label: "Github",
    fontSize: 6,
    opacity: 5,
  },
  {
    label: "SASS",
    fontSize: 6,
    opacity: 6,
  },
  {
    label: "Node.js",
    fontSize: 4,
    opacity: 4,
  },
  {
    label: "JSX",
    fontSize: 8,
    opacity: 5,
  },
  {
    label: "CSS Javascript",
    fontSize: 4,
    opacity: 6,
  },
  {
    label: "NextJS",
    fontSize: 4,
    opacity: 4,
  },
  {
    label: "Bootstrap",
    fontSize: 5,
    opacity: 3,
  },
];

class TagCloudW extends Component {
  render() {
    return (
      <TagCloud
        className="tag-cloud"
        // rotate={() => Math.round(Math.random() * 180)}
        spiral={1}
        style={{
          fontFamily: "sans-serif",
          // fontSize: () => Math.round(Math.random() * 50) + 16,
          fontSize: 30,
          // color: () => randomColor(colorarray),
          padding: 5,
          width: "100%",
          height: "400px",
        }}
        data={data}
        colorarray={colorarray}
      >
        {renderData(data)}
        <div
          style={{
            fontSize: 30,
            fontWeight: "bold",
            opacity: 0.9,
            padding: 12,
            color: "black",
          }}
        ></div>
      </TagCloud>
    );
  }
}
export default TagCloudW;
