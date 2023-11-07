import { useState } from 'react'


const nodeColor = '#00FF1B';
const lineColor = '#000000'

// SVG element for a node
function Node({x, y, radius = 10, setActive}) {
  return (
    <circle cx={x} cy={y} r={radius} fill={nodeColor} stroke={lineColor} stroke-width='0.5%' onMouseDown={setActive}/>
  )
}



// Creates an array of nodes given a node list
function NodeList({nodes, links, nodeOnTop = null, setActive}) {


  // Iterate through the nodes, creating a svg element for each
  const nodeList = Object.entries(nodes).map(([nodeName, nodeObject]) => <Node key={nodeName}
									       x={nodeObject.x}
									       y={nodeObject.y}
									       url={nodeObject.url}
									       setActive={() => setActive(nodeName)}/>)

  // If a user is moving a node, move it to the top so that it appears over other nodes
  if (nodeOnTop) {

    
    // index of node to move
    let nodeIndex;

    // search for node
    for (const index in nodeList) {
      if (nodeList[index].key === nodeOnTop) {
	nodeIndex = index;
	break;
      }
    }

    const node = nodeList[nodeIndex];
    // delete node from list
    nodeList.splice(nodeIndex, 1);
      
    // put it at the front
    nodeList.push(node);
  }

  return nodeList
}

// SVG element for a link between nodes
function Link({source, target}) {

  return (
    <line x1={source.x} y1={source.y} x2={target.x} y2={target.y} stroke={lineColor} strokeWidth={3}/>
  )
}


function getNumLinks(nodeName, links) {

  let count = 0;

  // Count how nodes are connected to nodeName
  for (const link of links) {
    if (link.source == nodeName || link.target == nodeName) {
      count += 1;
    }
  }

  return count;
}


export default function Graph({nodes, links,  width = 400, height = 500}) {


  // Node that is currently being dragged
  const [activeNode, setActiveNode] = useState(null);


  // Value inner padding when placing nodes initially
  const sidePadding = width * .2;
  const topPadding = height * .2;

  // Place nodes
  const tempNodes = {}

  for (const node of nodes) {

    const x = Math.floor(Math.random() * (width - sidePadding * 2)) + sidePadding;
    const y = Math.floor(Math.random() * (height - topPadding * 2)) + topPadding;

    tempNodes[node] = {x: x, y: y, radius: 20};

    // Assign location randomly
    
  }

  const [graphNodes, setGraphNodes] = useState(tempNodes);
  
  
  // Color for the background of the graph
  const backgroundFill = '#eeeeee'
  const baseNodeRadius = 10;

  // Function called when mouse moves over the graph
  const mouseMoved = e => {

    
    // If the mouse is held down on a node, update its coordinates 
    if(activeNode) {
      
      // Create a copy to edit the coords
      const nodesCopy = {...graphNodes};


      // New location of node
      const deltaX = nodesCopy[activeNode].x + e.movementX;
      const deltaY = nodesCopy[activeNode].y + e.movementY;


      // Move the dragged node, if it hits the bound keep it where it is
      nodesCopy[activeNode].x = deltaX > width || deltaX < 0 ? nodesCopy[activeNode].x : deltaX;
      nodesCopy[activeNode].y = deltaY > height || deltaY < 0 ? nodesCopy[activeNode].y : deltaY;

      
      // Update nodes
      setGraphNodes(nodesCopy);
    }
  }

  const mouseIn = e => {
    const nodesCopy = {...graphNodes};

    if (activeNode) {
      nodesCopy[activeNode].x = e.pageX - (e.target.offsetLeft || 0);
      nodesCopy[activeNode].y = e.pageY - (e.target.offsetTop || 0);
    }
  }

  // When the mouse isn't being held down, set the active node to null
  const mouseUp = () => {
    setActiveNode(null);
  }


  
  return (
    <div id="Graph">
      <svg viewBox={'0 0 ' + width + ' ' + height} width={width} height={height} onMouseMove={mouseMoved} onMouseUp={mouseUp} onMouseEnter={mouseIn}>
	
	<rect width={width} height={height} fill={backgroundFill} />
	
	{links && links.map((link, i) => <Link key={i}
					       source={graphNodes[link.source]}
					       target={graphNodes[link.target]} />)}

	
	{graphNodes && <NodeList nodes={graphNodes} links={links} nodeOnTop={activeNode} setActive={setActiveNode}/>}
	
      </svg>
    </div>
  )
}
