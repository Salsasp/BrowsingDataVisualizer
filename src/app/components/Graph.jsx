import { useState } from 'react'



// SVG element for a node
function Node({x, y, radius = 10, setActive}) {

  const fill = '#66FF19';
  
  return (
    <circle cx={x} cy={y} r={radius} fill={fill} onMouseDown={setActive}/>
  )
}

// SVG element for a link between nodes
function Link({source, target}) {

  const stroke = '#555555'; 

  return (
    <line x1={source.x} y1={source.y} x2={target.x} y2={target.y} stroke={stroke}/>
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
  const [graphNodes, setGraphNodes] = useState(nodes);
  
  // Color for the background of the graph
  const backgroundFill = '#eeeeee'
  const baseNodeSize = 10;

  // Function called when mouse moves over the graph
  const mouseMoved = e => {

    
    // If the mouse is held down on a node, update its coordinates 
    if(activeNode) {
      
      // Create a copy to edit the coords
      const nodesCopy = {...nodes};


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
    const nodesCopy = {...nodes};

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

	
	{nodes && Object.entries(graphNodes).map(([nodeName, node]) => <Node key={nodeName}
									x={node.x}
									y={node.y}
									url={node.url}
									setActive={() => setActiveNode(nodeName)}/>)}
	
      </svg>
    </div>
  )
}
