
# resistor-calculator-tool
Available here

https://maltegruber.github.io/resistor-calculator-tool/

I created this tool to simplify resistor calculations when designing electronics. It has a power resistor expression parser that supports any given configuration of parallel and series resistors.

There is also a tool for calculating a configuration of resistors to create a specific resistance.


## Input examples


```
Parallel: |
Series: +
-------
Three parallel resistors:
1M|1k|100

Three 1k resistors in parallel, which are parallel with 20k:
(1k|1E3|1000)|20k

Two 1k resistors in parallel in series with a 100 Ohm resistor
(1k|1k)+100

Two 1k resistors in series, parallel with a 2k resistor

(1k+1k)|2k

```

## Resistor replacement calculator
Enter the resistance you want to replace with some standard values. You can specify your collection of standard resistors in the URL and bookmark it. Here is an example URL

https://maltegruber.github.io/resistor-calculator-tool/?resistors=10,22,120,1k,2.7k,10k,1M


## Voltage Divider Tool
The voltage divider tool allows easy calculations of voltage dividers. You have to enter three values, and the fourth one (Say, the upper resistor value) will be calculated for you if you leave it blank. The input supports full resistor expressions.



## Developing

```bash
npm run dev
# or start the server and open the app in a new browser tab
npm run dev -- --open
```
## Building

To create a production version of this app

```bash
npm run build
```