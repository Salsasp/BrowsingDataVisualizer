import { useState, useEffect } from 'react'


const nodeColor = '#00FF1B';
const lineColor = '#000000'

// SVG element for a node
function Node({x, y, radius = 10, name, setActive, setHover, unsetHover}) {


  <circle cx={x} cy={y} r={radius} fill={nodeColor} stroke={lineColor} strokeWidth='0.5%' />
  return (
    <g>
      
      <image href={'https://t2.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=' + name} x={x - 8} y={y - 8} />
      <circle opacity={"0.0"} r={radius} cy={y} cx={x} onMouseDown={setActive} onMouseEnter={setHover} onMouseLeave={unsetHover} />
      </g>
  )
}



// Creates an array of nodes given a node list
function NodeList({nodes, nodeOnTop = null, setActive, setHover = () => {}, unsetHover = () => {}}) {


  // Iterate through the nodes, creating a svg element for each
  const nodeList = Object.entries(nodes).map(([nodeName, nodeObject]) => <Node key={nodeName}
									       name={nodeName}
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
export default function Graph({nodes, links, setInfoNode = () => {}, width = 800, height = 600}) {


  // Node that is currently being dragged
  const [activeNode, setActiveNode] = useState(null);

  // Node that is being hovered over
  const [hoveredNode, setHoveredNode] = useState(null);

  

  const tempNodes = {}

  const [graphNodes, setGraphNodes] = useState(false);


  // How long each physics tick is, in milliseconds
  const physicsTick = 20;
  const [mouseVel, setMouseVel] = useState(null);


  // Maximum velocity
  const maxVel = 2;
  
  // Update the positions of all the nodes according to their velocities, and decrease their velocity by accel
  const updateNodePositions = (setGraphNodes, activeNode, mouseVel) => {

    // Deceleration constant of nodes, in units per second
    const accel = .8;
    const minVel = 0.01;
    
    setGraphNodes(graphNodes => {
      // If the mouse is held down on a node, update its coordinates 


      const nodesCopy = {...graphNodes};
      
      if (graphNodes) {

	for (const [node, values] of Object.entries(graphNodes)) {
	  if (node !== activeNode) {
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

	    // Cap the maximum velocity
	    if (Math.abs(values.vel.x) > maxVel) {
	      values.vel.x = values.vel.x > 0 ? maxVel : -1 * maxVel;
	    }

	    if (Math.abs(values.vel.y) > maxVel) {
	      values.vel.y = values.vel.y > 0 ? maxVel : -1 * maxVel;
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

    if (nodes) {

      // inner padding when placing nodes initially
      const sidePadding = width * .2;
      const topPadding = height * .2;

      for (const node of nodes) {

	// Nodes that have an immediate connection with this node
	const connectedNodes = {}

	for (const link of links) {
	  if (link.source === node || link.target === node) {

	    const connNode = link.source === node ? link.target : link.source;
	    connectedNodes[connNode] = true;
	  }
	}
	
	// Randomly assign position
	const x = Math.ceil(Math.random() * (width - 2 * sidePadding)) + sidePadding;
	const y = Math.ceil(Math.random() * (height - 2 * topPadding)) + topPadding;

	
	tempNodes[node] = {x: x, y: y, vel: {x: 0, y: 0}, radius: 20, connectedNodes};
      }


      const setConnectedNodes = (node, foundNodes) => {


	
	// Add immediately connected nodes
	for (const [connNode, _] of Object.entries(node.connectedNodes)) {
	  foundNodes[connNode] = true;
	}

	// search through connected nodes
	for (const [adjNode, _] of Object.entries(node.connectedNodes)) {

	  for (const [connNode, _] of Object.entries(tempNodes[adjNode]["connectedNodes"])) {
	    if (!foundNodes[connNode]) {
	      foundNodes[connNode] = true;
	      setConnectedNodes(tempNodes[connNode], foundNodes);
	    }
	  }

	}
	
	node.connectedNodes = foundNodes;
      };
      // Connect all nodes
      for (const [node, _] of Object.entries(tempNodes)) {
	const allConnections = {};
	allConnections[node] = true;
	setConnectedNodes(tempNodes[node], allConnections);

	tempNodes[node]["connectedNodes"] = allConnections;
      }
      // Update nodes
      setGraphNodes(tempNodes);

    }    
  }, [])


  // Update positions ever `physicsTick` milliseconds
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


      // Update the dragged node's velocity

      nodesCopy[activeNode].vel.x = e.movementX;
      nodesCopy[activeNode].vel.y = e.movementY;

      
      const deltaX = nodesCopy[activeNode].x + e.movementX;
      const deltaY = nodesCopy[activeNode].y + e.movementY;
      

      // Only move node if it's within the bounds
      if (deltaX > 0 && deltaX < width && deltaY > 0 && deltaY < height) {
	nodesCopy[activeNode].x = deltaX;
	nodesCopy[activeNode].y = deltaY;
      }

      // Velocity scalar. Higher = faster nodes;
      const velScalar = 4;


      // Set velocities of other nodes
      for (const [node, _] of Object.entries(graphNodes[activeNode]["connectedNodes"])) {

	const values = graphNodes[node];
	
	if (node != activeNode) {

	  const velVectorLength = Math.hypot(nodesCopy[activeNode].vel.x + nodesCopy[activeNode].vel.y);

	  // Unit vectors for active node's velocity

	  let unitVelX;
	  let unitVelY;
	  
	  if (velVectorLength != 0) {
	    unitVelX = nodesCopy[activeNode].vel.x / velVectorLength;
	    unitVelY = nodesCopy[activeNode].vel.y / velVectorLength;
	  } else {
	    unitVelX = 0;
	    unitVelY = 0;
	  }
	  
	  // If node is moving towards or away from this node
	  const movingTowardsX = (nodesCopy[node].x - nodesCopy[activeNode].x) * unitVelX > 0;
	  const movingTowardsY = (nodesCopy[node].y - nodesCopy[activeNode].y) * unitVelY > 0;


	  let velX = velScalar;
	  let velY = velScalar;

	  // If the active node is moving towards this node, add less velocity
	  if (movingTowardsX) {
	    velX = velScalar / 4;
	  } 

	  if (movingTowardsY) {
	    velY = velScalar / 4
	  }

	  // Random motion
	  let randomX = Math.random() * unitVelX / physicsTick * 5;
	  let randomY = Math.random() * unitVelY / physicsTick * 5;

	  if (Math.random() > .5) {
	    randomX = randomX * -1;
	  }

	  if (Math.random() > .5) {
	    randomY = randomY * -1;
	  }
	  
	  
	  // Set the velocity, adding some random motion in 
	  values.vel.x += unitVelX * velX / physicsTick + randomX;
	  values.vel.y += unitVelY * velY / physicsTick + randomY;


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
    setInfoNode(activeNode || nodeName);
  }

  // Unset hovered node 
  const nodeLeave = () => {
    setHoveredNode(null);
  }

  // Deactivate dragging if the mouse leaves the canvas
  const canvasLeave = () => {
    if (!hoveredNode) {
      setActiveNode(null);
    }
  }


  
  return (
    <div id="Graph">
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
