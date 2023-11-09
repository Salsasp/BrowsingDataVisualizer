import { useState } from 'react'



// SVG element for a node
function Node({x, y, visits, setActive}) {

  const radius = visits;
  const fill = '#66FF19';
  
  return (
    <circle cx={x} 
    cy={y} 
    r={radius} 
    fill={fill} 
    onMouseDown={setActive}
    onClick={() => setLabel(`Node at (${x}, ${y}) with ${visits} visits`)}
    />
  )
}

// SVG element for a link between nodes
function Link({source, target}) {

  const stroke = '#555555'; 

  return (
    <line x1={source.x} y1={source.y} x2={target.x} y2={target.y} stroke={stroke}/>
  )
}

// Component to display label
function setLabel({label}) {
  return (
    <div>{label}</div>
  )
}

export default function Graph({nodes, links,  width = 400, height = 500}) {

  const [graphNodes, setGraphNodes] = useState(nodes);

  // Node that is currently being dragged
  const [activeNode, setActiveNode] = useState(null);

  const [label, setLabel] = useState(null);

  // Color for the background of the graph
  const backgroundFill = '#eeeeee'


  // Function called when mouse moves over the graph
  const mouseMoved = e => {
    // If the mouse is held down on a node, update its coordinates 
    if(activeNode) {
    
      // Create a copy to edit the coords
      const nodesCopy = {...nodes};

      // Move the dragged node
      nodesCopy[activeNode].x = nodesCopy[activeNode].x + e.movementX;
      nodesCopy[activeNode].y = nodesCopy[activeNode].y + e.movementY;

      
      // Update nodes
      setGraphNodes(nodesCopy);
    }
  }


  // When the mouse isn't being held down, set the active node to null
  const mouseUp = () => {
    setActiveNode(null);
  }


  
  return (
    <div id="Graph">
      <svg viewBox={'0 0 ' + width + ' ' + height} width={width} height={height} onMouseMove={mouseMoved} onMouseUp={mouseUp}>
	
	<rect width={width} height={height} fill={backgroundFill} />
	
	{links && links.map((link, i) => <Link key={i}
					       source={nodes[link.source]}
					       target={nodes[link.target]} />)}

	
	{nodes && Object.entries(nodes).map(([nodeName, node]) => <Node key={nodeName}
									x={node.x}
									y={node.y}
									url={node.url}
                  visits={node.visits}
									setActive={() => setActiveNode(nodeName)}/>)}
	
      </svg>
    </div>
  )
}
