<h1 align="center">
  <br>
    🔍 gowitness v2
  <br>
  <br>
</h1>

<h4 align="center">A golang, web screenshot utility using Chrome Headless.</h4>
<p align="center">
  <a href="https://twitter.com/leonjza"><img src="https://img.shields.io/badge/twitter-%40leonjza-blue.svg" alt="@leonjza" height="18"></a>
  <a href="https://goreportcard.com/report/github.com/sensepost/gowitness"><img src="https://goreportcard.com/badge/github.com/sensepost/gowitness" alt="Go Report Card" height="18"></a>
  <a href="https://github.com/sensepost/gowitness/actions/workflows/docker.yml"><img alt="Docker build & Push" src="https://github.com/sensepost/gowitness/actions/workflows/docker.yml/badge.svg"></a>
</p>
<br>


## screenshots

![dark](images/gowitness-detail.png)

## credits

`gowitness` would not have been posssible without some of these amazing projects: [chromedp](https://github.com/chromedp/chromedp), [tabler](https://github.com/tabler/tabler), [zerolog](https://github.com/rs/zerolog), [cobra](https://github.com/spf13/cobra), [gorm](https://github.com/go-gorm/gorm), [go-nmap](https://github.com/lair-framework/go-nmap), [wappalyzergo](https://github.com/projectdiscovery/wappalyzergo), [goimagehash](https://github.com/corona10/goimagehash)

## license

`gowitness` is licensed under a [GNU General Public v3 License](https://www.gnu.org/licenses/gpl-3.0.en.html). Permissions beyond the scope of this license may be available at <http://sensepost.com/contact/>.

## New Feature  

- [X] Added queue for screenshot feature (MAX_JOB=5).  
[https://github.com/X-Cotang/gowitness-wrap/blob/51092960f4eccb33d937f0bdec99119057f9ca53/cmd/server.go#L22](https://github.com/X-Cotang/gowitness-wrap/blob/51092960f4eccb33d937f0bdec99119057f9ca53/cmd/server.go#L22)  

```
curl -X POST http://localhost:7171/api/screenshot/v2 --data '{"url": "https://google.com"}'
```  

- [X] New Tab: Error Log  
- [X] Array input  

```
curl -X POST http://localhost:7171/api/screenshot/v2 --data '{"urls": ["https://google.com","https://youtube.com"]}'
```
- [ ] Callback function for other tools
- [ ] Truncate old data