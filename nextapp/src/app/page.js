"use client"

import BrowsingGraph from './components/Graph'

export default function Home() {

  const nodes = ["first", "second", "third", "fourth", "fifth"];
  const links = [{source: "first", target: "second"}, {source: "second", target: "third"}, {source: "third", target: "first"}, {source: "fourth", target: "first"}, {source: "fourth", target: "third"}, {source: "fifth", target: "third"}];
  
  return (
    <div>
      <BrowsingGraph nodes={nodes} links={links} />
    </div>
  )
}
