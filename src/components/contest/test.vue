<template>
  <base-box-frame>
    <latex-viewer :text="test"/>
  </base-box-frame>
</template>

<script>
import LatexViewer from "@/components/globals/latex-viewer";
import BaseBoxFrame from "@/components/globals/base-box-frame";

const test = '<div class="problem-statement">\n' +
    '            <div class="header">\n' +
    '              <div class="title">A. Hard Way</div>\n' +
    '              <div class="time-limit">\n' +
    '                <div class="property-title">time limit per test</div>\n' +
    '                1 second\n' +
    '              </div>\n' +
    '              <div class="memory-limit">\n' +
    '                <div class="property-title">memory limit per test</div>\n' +
    '                256 megabytes\n' +
    '              </div>\n' +
    '              <div class="input-file">\n' +
    '                <div class="property-title">input</div>\n' +
    '                standard input\n' +
    '              </div>\n' +
    '              <div class="output-file">\n' +
    '                <div class="property-title">output</div>\n' +
    '                standard output\n' +
    '              </div>\n' +
    '            </div>\n' +
    '            <div><p>Sam lives in Awesomeburg, its downtown has a triangular shape. Also, the following is\n' +
    '              true about the triangle:</p>\n' +
    '              <ul>\n' +
    '                <li> its vertices have integer coordinates,</li>\n' +
    '                <li> the coordinates of vertices are non-negative, and</li>\n' +
    '                <li> its vertices are not on a single line.</li>\n' +
    '              </ul>\n' +
    '              <p>He calls a point on the downtown\'s border (that is the border of the triangle) <span\n' +
    '                  class="tex-font-style-it">safe</span> if he can reach this point from <span\n' +
    '                  class="tex-font-style-bf">at least one point</span> of the line $$$y = 0$$$ walking\n' +
    '                along some <span class="tex-font-style-bf">straight line</span>, without crossing the\n' +
    '                interior of the triangle.</p>\n' +
    '              <center><img class="tex-graphics"\n' +
    '                           src="https://espresso.codeforces.com/3af75fe0f0ad2ea085c6b65778931d20cfda14ec.png"\n' +
    '                           style="max-width: 100.0%;max-height: 100.0%;"/> <span\n' +
    '                  class="tex-font-size-small">In the picture the downtown is marked with grey color. The first path is invalid because it does not go along a straight line. The second path is invalid because it intersects with the interior of the downtown. The third and fourth paths are correct.</span>\n' +
    '              </center>\n' +
    '              <p>Find the total length of the unsafe parts of the downtown border. It can be proven that\n' +
    '                these parts are segments and their number is finite.</p></div>\n' +
    '            <div class="input-specification">\n' +
    '              <div class="section-title">Input</div>\n' +
    '              <p>Each test contains multiple test cases. The first line contains a single integer $$$t$$$\n' +
    '                ($$$1 \\le t \\le 1000$$$) — the number of test cases. Description of the test cases\n' +
    '                follows.</p>\n' +
    '              <p>Each test case contains three lines, each of them contains two integers $$$x_i$$$,\n' +
    '                $$$y_i$$$ ($$$0 \\le x_i, y_i \\le 10^9$$$)— coordinates of the vertices of the\n' +
    '                downtown\'s border.</p></div>\n' +
    '            <div class="output-specification">\n' +
    '              <div class="section-title">Output</div>\n' +
    '              <p>For each test case print a single number— the answer to the problem.</p>\n' +
    '              <p>Your answer will be considered correct if its absolute or relative error does not exceed\n' +
    '                $$$10^{-9}$$$. Formally let your answer be $$$a$$$, jury answer be $$$b$$$. Your answer\n' +
    '                will be considered correct if $$$\\frac{|a - b|}{\\max{(1, |b|)}} \\le 10^{-9}$$$.</p>\n' +
    '            </div>\n' +
    '            <div class="sample-tests">\n' +
    '              <div class="section-title">Example</div>\n' +
    '              <div class="sample-test">\n' +
    '                <div class="input">\n' +
    '                  <div class="title">Input</div>\n' +
    '                  <pre>\n' +
    '5\n' +
    '8 10\n' +
    '10 4\n' +
    '6 2\n' +
    '4 6\n' +
    '0 1\n' +
    '4 2\n' +
    '14 1\n' +
    '11 2\n' +
    '13 2\n' +
    '0 0\n' +
    '4 0\n' +
    '2 4\n' +
    '0 1\n' +
    '1 1\n' +
    '0 0\n' +
    '</pre>\n' +
    '                </div>\n' +
    '                <div class="output">\n' +
    '                  <div class="title">Output</div>\n' +
    '                  <pre>\n' +
    '0.0000000\n' +
    '0\n' +
    '2.0000\n' +
    '0.00\n' +
    '1\n' +
    '</pre>\n' +
    '                </div>\n' +
    '              </div>\n' +
    '            </div>\n' +
    '            <div class="note">\n' +
    '              <div class="section-title">Note</div>\n' +
    '              <p>In the picture, the downtowns of the first three test cases are illustrated. Triangles\n' +
    '                are enumerated according to the indices of test cases they belong to.</p>\n' +
    '              <center><img class="tex-graphics"\n' +
    '                           src="https://espresso.codeforces.com/f442c59b568984d466e5f29561428d3889903e9f.png"\n' +
    '                           style="max-width: 100.0%;max-height: 100.0%;"/></center>\n' +
    '              <p>In the first two test cases, all points on the borders of the downtowns are safe, thus\n' +
    '                the answers are $$$0$$$.</p>\n' +
    '              <p>In the following picture unsafe points for the third test case are marked with black\n' +
    '                color:</p>\n' +
    '              <center><img class="tex-graphics"\n' +
    '                           src="https://espresso.codeforces.com/e97888b309d46976dc1a9e03f5a8a012090ba8e9.png"\n' +
    '                           style="max-width: 100.0%;max-height: 100.0%;"/></center>\n' +
    '              <p>In the fourth test case, all points on the border of the downtown are safe.</p></div>\n' +
    '          </div>\n' +
    '          <p></p>'

export default {
  name: "test.vue",
  components: {BaseBoxFrame, LatexViewer},
  data(){
    return {
      test: test
    }
  }
}
</script>
<style scoped>

</style>
