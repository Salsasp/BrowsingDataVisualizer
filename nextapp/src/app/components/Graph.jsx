import { useState, useEffect } from 'react'


const nodeColor = '#00FF1B';
const lineColor = '#000000'

// SVG element for a node
function Node({x, y, radius = 10, setActive, setHover, unsetHover}) {

  return (
    <circle cx={x} cy={y} r={radius} fill={nodeColor} stroke={lineColor} strokeWidth='0.5%' onMouseDown={setActive} onMouseEnter={setHover} onMouseLeave={unsetHover}/>
  )
}



// Creates an array of nodes given a node list
function NodeList({nodes, nodeOnTop = null, setActive, setHover = () => {}, unsetHover = () => {}}) {


  // Iterate through the nodes, creating a svg element for each
  const nodeList = Object.entries(nodes).map(([nodeName, nodeObject]) => <Node key={nodeName}
									       x={nodeObject.x}
									       y={nodeObject.y}
									       url={nodeObject.url}
									       setActive={() => setActive(nodeName)}
									       setHover={() => setHover(nodeName)}
									       unsetHover={unsetHover}/>)

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

/**
 * Gets the number of links a node has
 *
 * @param nodeName - Name of the node
 * @param links - A list of objects wtih the format {source: 'node name', target: 'node name'}
 * @returns The number of links
 */
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

/**
 * Displays a graph
 *
 * @param nodes - A list of strings used to identify each node
 * @param links - A list of objects, in the format of {source: 'node name', target: 'node name'}
 * @param width - Optional parameter for the width of the svg
 * @parma height - Optional parameter for the height of the svg
 * @param setInfoNode - Optional function that takes one parameter and is given the node that is currently being hovered over or dragged
 */
export default function Graph({nodes, links, setInfoNode = () => {}, width = 400, height = 500}) {


  // Node that is currently being dragged
  const [activeNode, setActiveNode] = useState(null);

  // Node that is being hovered over
  const [hoveredNode, setHoveredNode] = useState(null);

  // inner padding when placing nodes initially
  const sidePadding = width * .2;
  const topPadding = height * .2;


  const tempNodes = {}

  const [graphNodes, setGraphNodes] = useState(null);
  
  // Do a one time setup to place nodes
  useEffect(() => {
    // Place nodes

    // Used for finding center of graph
    let xsum = 0;
    let ysum = 0;
    
    for (const node of nodes) {

      // Nodes that have an immediate connection with this node
      const connectedNodes = {}

      for (const link of links) {
	if (link.source === node || link.target === node) {
	  connectedNodes[links.source === node ? link.target : link.source] = true;
	}
      }
      
      // Randomly assign position
      const x = Math.ceil(Math.random() * (width - 2 * sidePadding)) + sidePadding;
      const y = Math.ceil(Math.random() * (height - 2 * topPadding)) + topPadding;

      xsum += x;
      ysum += y;
      
      tempNodes[node] = {x: x, y: y, radius: 20, connectedNodes};
    }


    const setConnectedNodes = (node, foundNodes) => {

      let foundAllNodes = true;

      let unsearchNodes = [];

      // Check to see if all nodes have been found
      for (const foundNode of foundNodes) {
	if (!node.connectedNodes[foundNode]) {
	  foundAllNodes = false;
	  unsearchedNodes.push(foundNode);
	}
      }

      if (foundAllNodes) {
	return;
      }

      for (const node of unsearchedNodes) {

	Object.entries(node.connectedNodes).map(connectedNode => {
	  foundNodes[connectedNode] = true;
	  getConnectedNodes(tempNode[connectedNode], foundNodes);
	})
      }

      node.connectedNodes = foundNodes;
    };
    // Connect all nodes
    for (const node of tempNodes) {
      setConnectedNodes(node);
    }

    // Find center of the graph
    const numNodes = nodes.length;
    const xCenter = xsum / numNodes;
    const yCenter = ysum / numNodes;

    const xShift = width / 2 - xCenter;
    const yShift = height / 2 - yCenter;

    // Shift graph to the center
    for (const [node, value] of Object.entries(tempNodes)) {
      tempNodes[node].x = value.x + xShift;
      tempNodes[node].y = value.y + yShift;
    }

    setGraphNodes(tempNodes);
  }, [])

  
  
  // Color for the background of the graph
  const backgroundFill = '#eeeeee'
  const baseNodeRadius = 10;

  // Function called when mouse moves over the graph
  const mouseMoved = e => {

    
    // If the mouse is held down on a node, update its coordinates 
    if(activeNode) {
      
      // Create a copy to edit the coords
      const nodesCopy = {...graphNodes};

      console.log(nodesCopy[activeNode].x, nodesCopy[activeNode].y)
      console.log(graphNodes[activeNode].x, graphNodes[activeNode].y)

      // New location of node
      const deltaX = nodesCopy[activeNode].x + e.movementX;
      const deltaY = nodesCopy[activeNode].y + e.movementY;


      console.log(e.movementX);
      console.log(e.movementY);
      // Move the dragged node, if it hits the bound keep it where it is
      nodesCopy[activeNode].x = deltaX > width || deltaX < 0 ? nodesCopy[activeNode].x : deltaX;
      nodesCopy[activeNode].y = deltaY > height || deltaY < 0 ? nodesCopy[activeNode].y : deltaY;

      
      // Update nodes
      setGraphNodes(nodesCopy);
    }
  }

  
  // When the mouse isn't being held down, set the active node to null
  const mouseUp = () => {
    setActiveNode(null);
  }


  // Set hovered node 
  const nodeEnter = nodeName => {
    setHoveredNode(nodeName);
    setInfoNode(nodeName);
  }

  // Unset hovered node 
  const nodeLeave = () => {
    setHoveredNode(null);
    setInfoNode(activeNode);
  }

  // Deactivate dragging if the mouse leaves the canvas
  const canvasLeave = () => {
    if (!hoveredNode) {
      setActiveNode(null);
      setInfoNode(null);
    }
  }


  
  return (
    <div id="Graph" >
      <svg className="rounded shadow"viewBox={'0 0 ' + width + ' ' + height} width={width} height={height} onMouseMove={mouseMoved} onMouseUp={mouseUp} onMouseLeave={canvasLeave} >
	
	<rect width={width} height={height} fill={backgroundFill} />
	
	{links && graphNodes && links.map((link, i) => <Link key={i}
					       source={graphNodes[link.source]}
					       target={graphNodes[link.target]} />)}

	
	{graphNodes && <NodeList nodes={graphNodes} links={links} nodeOnTop={activeNode} setActive={setActiveNode} setHover={nodeEnter} unsetHover={nodeLeave}/>}
	
      </svg>
    </div>
  )
}
