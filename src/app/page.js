"use client"

import BrowsingGraph from './components/Graph'

export default function Home() {

  const nodes = {"first": {x: 100, y: 100, url: "test.com"}, "second": {x: 100, y: 150, url: "test2.com"}, "third": {x: 150, y: 150, url: "test3.com"}, "fourth": {x: 200, y:200, url: "test4.com"}, "fifth": {x: 300, y:300, url: "test5.com"}};
  const links = [{source: "first", target: "second"}, {source: "second", target: "third"}, {source: "third", target: "first"}, {source: "fourth", target: "first"}, {source: "fourth", target: "third"}, {source: "fifth", target: "third"}];
  
  return (
    <div>
      <BrowsingGraph nodes={nodes} links={links} />
    </div>
  )
}
