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

  const [graphNodes, setGraphNodes] = useState(false);
  const [nodesArePlaced, setNodesArePlaced] = useState(false);


  // How long each physics tick is, in milliseconds
  const physicsTick = 20;
  const [mouseVel, setMouseVel] = useState(null);
  
  // Update the positions of all the nodes according to their velocities, and decrease their velocity by accel
  const updateNodePositions = (setGraphNodes, activeNode, mouseVel) => {

    // Deceleration constant of nodes, in units per second
    const accel = 0.5;
    const maxVel = 20;
    const minVel = 0.01;
    
    setGraphNodes(graphNodes => {
      // If the mouse is held down on a node, update its coordinates 


      const nodesCopy = {...graphNodes};
      
      if (graphNodes) {

	
	for (const [node, values] of Object.entries(graphNodes)) {


	  if (node != activeNode) {
	    // Update position

	    const newX = values.x + values.vel.x;
	    const newY = values.y + values.vel.y;

	    // Check the bounds
	    values.x = newX < 0 || newX > width ? values.x : newX;
	    values.y = newY < 0 || newY > height ? values.y : newY;

	    // Decrease velocity

	    if (values.vel.x != 0) {
	      values.vel.x = values.vel.x < 0 ? values.vel.x + accel / 1000 * physicsTick: values.vel.x - accel / 1000 * physicsTick;
	    }

	    if (values.vel.y != 0) {
	      values.vel.y = values.vel.y < 0 ? values.vel.y + accel / 1000 * physicsTick : values.vel.y - accel / 1000 * physicsTick;
	    }

	    // If velocity is  below threshold set it to zero

	    if (Math.abs(values.vel.x) < minVel) {
	      values.vel.x = 0;
	    }

	    if (Math.abs(values.vel.y) < minVel) {
	      values.vel.y = 0;
	    }

	    nodesCopy[node] = values;

	  }
	}

	return nodesCopy;
      } else {
	return graphNodes;
      }
    })
  };



  
  

  // Do a one time setup to place nodes
  useEffect(() => {
    // Place nodes

      // Used for finding center of graph
    let xsum = 0;
    let ysum = 0;

    for (const node of nodes) {

      // Randomly assign position
      const x = Math.ceil(Math.random() * (width - 2 * sidePadding)) + sidePadding;
      const y = Math.ceil(Math.random() * (height - 2 * topPadding)) + topPadding;

      xsum += x;
      ysum += y;
      
      tempNodes[node] = {x: x, y: y, vel: {x: 0, y: 0}, radius: 20};

      setNodesArePlaced(true);

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
    }
    // Update nodes

    
  }, [])

  useEffect (() => {
    const physics = setInterval(() => updateNodePositions(setGraphNodes, activeNode, mouseVel), physicsTick);
    
    return () => clearInterval(physics);
  }, [activeNode, mouseVel])



  
  
  // Color for the background of the graph
  const backgroundFill = '#eeeeee'
  const baseNodeRadius = 10;

  // Function called when mouse moves over the graph
  const mouseMoved = e => {


    if(activeNode) {
      
      // Create a copy to edit the coords
      const nodesCopy = {...graphNodes};

      const mouseVel = {x: e.movementX, y: e.movementY};

      // Update the dragged node's velocity

      nodesCopy[activeNode].vel.x = mouseVel.x;
      nodesCopy[activeNode].vel.y = mouseVel.y;

      const deltaX = nodesCopy[activeNode].x + mouseVel.x;
      const deltaY = nodesCopy[activeNode].y + mouseVel.y;
      

      // Only move node if it's within the bounds
      if (deltaX > 0 && deltaX < width && deltaY > 0 && deltaY < height) {
	nodesCopy[activeNode].x = deltaX;
	nodesCopy[activeNode].y = deltaY;
      }

      
      const maxVel = 1
      // Set velocities of other nodes
      for (const [node, values] of Object.entries(nodesCopy)) {

	if (node != activeNode) {
	  const distX = Math.abs(nodesCopy[activeNode].x - values.x);
	  const distY = Math.abs(nodesCopy[activeNode].y - values.y);

	  const activeVel = {x: nodesCopy[activeNode].vel.x, y: nodesCopy[activeNode].vel.y};


	  const movingTowardsX = nodesCopy[node].x - nodesCopy[activeNode].x 


	  // Set velocity according to distance
	  values.vel.x += (activeVel.x  / physicsTick + Math.random() * activeVel.x / physicsTick) * 0.5;
	  values.vel.y += (activeVel.y  / physicsTick + Math.random() * activeVel.y / physicsTick) * 0.5;

	  // Cap the maximum velocity

	  if (values.vel.x > maxVel) {
	    values.vel.x = maxVel;
	  }

	  if (values.vel.y > maxVel) {
	    values.vel.y = maxVel;
	  }

	  // Set it to zero if it's too far away

	  

	  nodesCopy[node] = values;
	}
      }
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
