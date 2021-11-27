const express = require('express');
const Category = require('./db/models/Category');
const bodyParser = require('body-parser');
const cors = require('cors');
const Record = require('./db/models/Record');
const { default: axios } = require('axios');
require('./db')

// functions
function convertToSlug(str) {
    // 1) convert to lower case
    // 2) remove all non-word characters
    // 3) replace all spaces with -
    // 4) remove all duplicated -
    // 5) trim - from end of string
    str = str.toLowerCase();
    str = str.replace(/^\s+|\s+$/g, ''); // trim
    str = str.replace(/[^a-z0-9 -]/g, '') // remove invalid chars
        .replace(/\s+/g, '-') // collapse whitespace and replace by -
        .replace(/-+/g, '-'); // collapse dashes

    return str;
}

// App config
const app = express();
app.use(express.json())
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.use('/ping', (req, res) => {
    res.json({
        msg: 'success',
        time: new Date().toLocaleString(),
    })
})

// CATEGORIES

app.use('/api/categories', (req, res) => {
    // fetch all categories
    console.log('fetch all categories')

    Category.find(req.query, (err, categories) => {
        if (err) {
            res.status(500).json({
                msg: 'error fetching categories',
                error: err
            })
        } else {
            res.json(categories)
        }
    }
    )

})

app.use('/api/add-category', (req, res) => {
    // add category
    const categoryName = req.body.name;
    console.log('add category')
    const category = new Category({
        name: categoryName,
        slug: convertToSlug(categoryName)
    })
    category.save((err, category) => {
        if (err) {
            res.status(500).json({
                msg: 'error saving category',
                error: err
            })
        } else {
            res.json(category)
        }
    })
})

app.use('/api/update-category', (req, res) => {
    // update category
    const categoryId = req.body.id;
    const categoryName = req.body.name;
    console.log('update category')
    Category.findByIdAndUpdate(categoryId, {
        name: categoryName,
        slug: convertToSlug(categoryName)
    }, (err, category) => {
        if (err) {
            res.status(500).json({
                msg: 'error updating category',
                error: err
            })
        } else {
            res.json(category)
        }
    }
    )
})

app.use('/api/delete-category', (req, res) => {
    // delete category
    const categoryId = req.body.id;
    console.log('delete category')
    Category.findByIdAndDelete(categoryId, (err, category) => {
        if (err) {
            res.status(500).json({
                msg: 'error deleting category',
                error: err
            })
        } else {
            res.json(category)
        }
    })
})


// RECORDS

app.use('/api/records', (req, res) => {
    // fetch all records
    console.log('fetch all records')
    Record.find(req.query, (err, records) => {
        if (err) {
            res.status(500).json({
                msg: 'error fetching records',
                error: err
            })
        } else {
            res.json(records)
        }
    }
    )
})

app.use('/api/add-record', (req, res) => {
    // add record
    const {
        name,
        categoryId,
        shortInfo,
        more_data_html
    } = req.body;

    console.log('add record')

    const record = new Record({
        name: name,
        slug: convertToSlug(name),
        categoryId: categoryId,
        short_information: shortInfo,
        last_date: new Date(), // change to lastdate when we have it
        updated_at: null,
        more_data_html: more_data_html
    })
    record.save((err, record) => {
        if (err) {
            res.status(500).json({
                msg: 'error saving record',
                error: err

            })
        } else {
            res.json(record)
        }
    })
})

app.use('/api/delete-record', (req, res) => {
    // delete record
    const recordId = req.body.id;
    console.log('delete record')
    Record.findByIdAndDelete(recordId, (err, record) => {
        if (err) {
            res.status(500).json({
                msg: 'error deleting record',
                error: err
            })
        } else {
            res.json(record)
        }
    })
})

app.use('/test', async (req, res) => {
    const data = {
        more_data_html: `<table width="671" border="1" cellspacing="0" cellpadding="0">
        <tbody>
        <tr>
        <td colspan="6" valign="top" width="671">
        <h2 align="center"><b><span style="color: #ff00ff;">Staff Selection Commission (SSC)</span> </b><b></b></h2>
        <h2 align="center"><span style="color: #008000;"><b>SSC GD Constable Admit Card 2021</b></span></h2>
        <h2 align="center"><span style="color: #ff00ff;"><b>SSC Constable Exam 2021 - Short Details of Notification</b></span></h2>
        <h2 align="center"><span style="color: #ff0000;"><b><a title="Sarkari Result Official Website" href="https://www.sarkariresult.com/" target="_blank"><span style="color: #ff0000;">WWW.SARKARIRESULT.COM</span></a></b></span><b></b></h2>
        </td>
        </tr>
        <tr>
        <td colspan="3" valign="top" width="329">
        <h2 align="center"><span style="color: #008000;"><b>Important Dates</b></span><b></b></h2>
        <ul>
        <li>Exam Date : <b>16/11/2021 to 15/12/2021
        </b></li>
        <li>Form Status Available :<b> 20/10/2021</b></li>
        </ul>
        </td>
        <td colspan="3" valign="top" width="342">
        <h2 align="center"><span style="color: #008000;"><b>Exam Conducted By</b></span><b></b></h2>
        <ul>
        <li>Staff Selection Commission SSC Central Region CR, NR, MPR, KKR &amp; Other Region Are Conducted the Constable Recruitment 2021.</li>
        </ul>
        </td>
        </tr>
        <tr>
        <td colspan="6" valign="top" width="671">
        <h2 align="center"><span style="color: #ff00ff;"><b>Eligibility to Download SSC GD Constable Application Form Status 2021</b></span></h2>
        <ul>
        <li>Candidates Who Are Enrolled / Registered in SSC General Duty Constable Recruitment 2021 Are Eligible to Check the Application Form Status.</li>
        </ul>
        </td>
        </tr>
        <tr>
        <td colspan="6" valign="top" width="671">
        <center> <script async="" src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js" type="text/javascript"></script>
        
        <ins class="adsbygoogle" style="display:inline-block;width:300px;height:250px" data-full-width-responsive="true" data-ad-client="ca-pub-9222595088627935" data-ad-slot="1698571817" data-adsbygoogle-status="done" data-ad-status="filled"><ins id="aswift_2_expand" style="border: none; height: 250px; width: 300px; margin: 0px; padding: 0px; position: relative; visibility: visible; background-color: transparent; display: inline-table;" tabindex="0" title="Advertisement" aria-label="Advertisement"><ins id="aswift_2_anchor" style="border: none; height: 250px; width: 300px; margin: 0px; padding: 0px; position: relative; visibility: visible; background-color: transparent; display: block;"><iframe id="aswift_2" name="aswift_2" style="left:0;position:absolute;top:0;border:0;width:300px;height:250px;" sandbox="allow-forms allow-popups allow-popups-to-escape-sandbox allow-same-origin allow-scripts allow-top-navigation-by-user-activation" width="300" height="250" frameborder="0" src="https://googleads.g.doubleclick.net/pagead/ads?client=ca-pub-9222595088627935&amp;output=html&amp;h=250&amp;slotname=1698571817&amp;adk=1749865037&amp;adf=1984487227&amp;pi=t.ma~as.1698571817&amp;w=300&amp;lmt=1637594772&amp;psa=1&amp;format=300x250&amp;url=https%3A%2F%2Fwww.sarkariresult.com%2F2021%2Fssc-gd-constable-form-status%2F&amp;flash=0&amp;fwrattr=true&amp;wgl=1&amp;uach=WyJtYWNPUyIsIjEyLjAuMSIsImFybSIsIiIsIjk1LjAuNDYzOC42OSIsW10sbnVsbCxudWxsLCI2NCJd&amp;dt=1637594772266&amp;bpp=1&amp;bdt=1212&amp;idt=53&amp;shv=r20211111&amp;mjsv=m202111110101&amp;ptt=9&amp;saldr=aa&amp;abxe=1&amp;cookie=ID%3Df8894fa61ccc9368-22b2e5af3acf002a%3AT%3D1637594765%3ART%3D1637594765%3AS%3DALNI_MZ5a2MuAZlpqk35sOgjVy7LAT6JsA&amp;prev_fmts=0x0%2C1000x280&amp;nras=1&amp;correlator=6763267550213&amp;frm=20&amp;pv=1&amp;ga_vid=1216749822.1637594765&amp;ga_sid=1637594772&amp;ga_hid=243258527&amp;ga_fc=1&amp;u_tz=330&amp;u_his=4&amp;u_h=900&amp;u_w=1440&amp;u_ah=805&amp;u_aw=1440&amp;u_cd=30&amp;dmc=8&amp;adx=409&amp;ady=1716&amp;biw=1440&amp;bih=694&amp;scr_x=0&amp;scr_y=624&amp;eid=182982100%2C182982300%2C31062930&amp;oid=2&amp;pvsid=316969933955186&amp;pem=732&amp;tmod=1840562053&amp;ref=https%3A%2F%2Fwww.sarkariresult.com%2F&amp;eae=0&amp;fc=1920&amp;brdim=0%2C25%2C0%2C25%2C1440%2C25%2C1440%2C805%2C1440%2C694&amp;vis=1&amp;rsz=d%7C%7CeEbr%7C&amp;abl=CS&amp;pfx=0&amp;fu=0&amp;bc=31&amp;ifi=3&amp;uci=a!3&amp;btvi=1&amp;fsb=1&amp;xpc=JTX6OE9KcW&amp;p=https%3A//www.sarkariresult.com&amp;dtd=55" marginwidth="0" marginheight="0" vspace="0" hspace="0" allowtransparency="true" scrolling="no" allowfullscreen="true" allow="attribution-reporting" data-google-container-id="a!3" data-google-query-id="CN6w0PWjrPQCFc0W1QodAcEEgg" data-load-complete="true"></iframe></ins></ins></ins>
        <script type="text/javascript">
             (adsbygoogle = window.adsbygoogle || []).push({});
        </script></center>
        <h2 align="center"><span style="color: #008000;"><b>How to Check SSC GD Constable Form Status 2021</b></span></h2>
        <ul>
        <li>SSC has released the form status of Constable GD Recruitment 2021. The candidates who are registered for this recruitment can check and check their form status online very easily.</li>
        <li><b>First Method to Check Status SSC GD Constable 2021:</b> By this method only the candidates who have For Online Applicant Only can check status of SSC Constable General Duty Recruitment CBT Exam 2021. In order to check status in the first method, the candidate must have the registration number and date of birth of the application. After entering these two things on the portal, you will have to search, you will start seeing your information and will be able to see the current status of SSC GD Exam Recruitment Form easily.</li>
        <li><b>Second and most popular method <b> to Check Form Status SSC GD Constable Exam 2021 </b>:</b> In this method, neither the registration number nor the roll number of the exam will be required to download the SSC Constable GD Exam held on<strong> 16 November 2021</strong> to <strong>15 December 2021</strong> by this method on the SSC website is called If You Do Not Know Your Roll NO. In this method, the candidate will have to search the portal by entering the first four letters of his name and the first four letters of his father's name along with his date of birth. After that the information of the candidate will start appearing on the portal, from the same candidate can also Check Your Status.</li>
        <li><strong>Popular Reasons of Rejection Form : </strong>The status of SSC GD Recruitment 2021 Form is out. Many candidates have been rejected by SSC for this application because the photo they had scanned in the application form did not print the date of the photo. This is one of the main reasons for the rejection of the application.</li>
        </ul>
        </td>
        </tr>
        <tr>
        <td colspan="6" valign="top" width="671">
        <h2 align="center"><span style="color: #ff00ff;"><b>Enrolled Candidate Can Check SSC GD Constable Exam Admit Card 2021</b></span><b></b></h2>
        </td>
        </tr>
        <tr>
        <td colspan="6" valign="top" width="671">
        <h2 align="center"><span style="color: #008000;"><b>Download Mobile Apps for the Latest Updates</b></span><b></b></h2>
        </td>
        </tr>
        <tr>
        <td colspan="2" valign="top" width="277">
        <h2 align="center"><b><a title="Sarkari Result Free Android App Download" href="https://play.google.com/store/apps/details?id=com.app.app14f269771c01" target="_blank">Android Apps</a></b></h2>
        </td>
        <td colspan="4" valign="top" width="394">
        <h2 align="center"><b><a title="Sarkari Result Free Apple IOS App Download" href="https://itunes.apple.com/us/app/sarkari-result/id1051363935?ls=1&amp;mt=8" target="_blank">Apple IOS Apps</a></b></h2>
        </td>
        </tr>
        <tr>
        <td colspan="6" valign="top" width="671">
        <h2 align="center"><b><span style="color: #008000;">SSC GD Constable Exam Form Status Check Link</span> </b><b></b></h2>
        </td>
        </tr>
        <tr>
        <td valign="top" width="269">
        <h2 align="center"><span style="color: #ff00ff;"><b>Candidate State Name</b></span></h2>
        </td>
        <td colspan="4" valign="top" width="213">
        <h2 align="center"><span style="color: #008000;"><b>SSC Region Name</b></span></h2>
        </td>
        <td valign="top" width="190">
        <h2 align="center"><span style="color: #ff0000;"><b>SSC Admit Card Link</b></span></h2>
        </td>
        </tr>
        <tr>
        <td valign="top" width="269">
        <p align="center">Uttar Pradesh &amp; Bihar</p>
        </td>
        <td colspan="4" valign="top" width="213">
        <p align="center">SSC Central Region CR GD Constable Exam Admit Card 2021</p>
        </td>
        <td valign="top" width="190">
        <h2 align="center"><a title="SSC CR Region Status Check Link " href="https://www.ssc-cr.org/const_gd_capfs_nia_ssf_assam_rifle_2021_1921.php?proceed=yes" target="_blank"><b>Click Here</b></a></h2>
        </td>
        </tr>
        <tr>
        <td valign="top" width="269">
        <p align="center">How to Check Form Status</p>
        </td>
        <td colspan="4" valign="top" width="213">
        <p align="center">SSC GD Constable Form Status How to Check (Video Hindi)</p>
        </td>
        <td valign="top" width="190">
        <h2 align="center"><a title="SSC Form Status Kaise Check Kare" href="https://www.youtube.com/watch?v=JjQyeFkP-Ew" target="_blank"><b>Click Here</b></a></h2>
        </td>
        </tr>
        <tr>
        <td valign="top" width="269">
        <p align="center">Rajasthan, Delhi, Uttarakhand</p>
        </td>
        <td colspan="4" valign="top" width="213">
        <p align="center">SSC Northern Region NR GD Constable Exam Form Status 2021</p>
        </td>
        <td valign="top" width="190">
        <h2 align="center"><a title="SSC NR Delhi Region Admit Card 2021" href="https://sscnr.nic.in/newlook/Status_GDConstable_AssamRifles_Exam_2021/CheckRoll.aspx" target="_blank"><b>Click Here</b></a></h2>
        </td>
        </tr>
        <tr>
        <td valign="top" width="269">
        <p align="center">Madhya Pradesh, Chhattisgarh</p>
        </td>
        <td colspan="4" valign="top" width="213">
        <p align="center">SSC Madhya Pradesh MPR GD Constable Exam Admit Card 2021</p>
        </td>
        <td valign="top" width="190">
        <h2 align="center"><a title="SSC Admit Card MPR Region 2021" href="https://www.sscmpr.org/index.php?Page=const_gd_capfs_nia_ssf_assam_rifle_2021_1839" target="_blank"><b>Click Here</b></a></h2>
        </td>
        </tr>
        <tr>
        <td valign="top" width="269">
        <p align="center">Mock Test Practice Link</p>
        </td>
        <td colspan="4" valign="top" width="213">
        <p align="center">Mock Test Practice Link 2021</p>
        </td>
        <td valign="top" width="190">
        <h2 align="center"><a title="SSC Admit Card MPR Region 2021" href="https://g27.digialm.com/OnlineAssessment/index.html?2207@@M23" target="_blank"><b>Click Here</b></a></h2>
        </td>
        </tr>
        <tr>
        <td valign="top" width="269">
        <p align="center">West Bengal, Orrisa, Jharkhand, A&amp;N Island, Sikkim</p>
        </td>
        <td colspan="4" valign="top" width="213">
        <p align="center">SSC Eastern Region ER GD Constable Exam Form Status 2021</p>
        </td>
        <td valign="top" width="190">
        <h2 align="center"><a title="SSC ER Region Admit Card 2021" href="http://117.247.74.231/cgd2021kyr/KYR/kyr.php" target="_blank"><b>Click Here</b></a></h2>
        </td>
        </tr>
        <tr>
        <td valign="top" width="269">
        <p align="center">Hariyana, Punjab, J&amp;K, Himachal Pradesh</p>
        </td>
        <td colspan="4" valign="top" width="213">
        <p align="center">SSC North Western Sub Region NWR GD Constable Exam Admit Card Status 2021</p>
        </td>
        <td valign="top" width="190">
        <h2 align="center"><a title="SSC NWR Region Admit Card 2021" href="https://www.ssc-cr.org/const_gd_capfs_nia_ssf_assam_rifle_2021_status.php" target="_blank"><b>Click Here</b></a></h2>
        </td>
        </tr>
        <tr>
        <td valign="top" width="269">
        <p align="center">Karnataka, Kerla</p>
        </td>
        <td colspan="4" valign="top" width="213">
        <p align="center">SSC KKR Region GD Constable Exam Form Status 2021</p>
        </td>
        <td valign="top" width="190">
        <h2 align="center"><a title="SSC KKR Admit Card 2021" href="https://ssc.nic.in/Portal/AdmitCard" target="_blank"><b>Click Here</b></a></h2>
        </td>
        </tr>
        <tr>
        <td valign="top" width="269">
        <p align="center">Assam, Arunachal Pradesh, Manipur, Meghalaya, Tripura, Nagaland, Mizoram</p>
        </td>
        <td colspan="4" valign="top" width="213">
        <p align="center">SSC North East Region NER Region GD Constable Exam Admit Card Status 2021</p>
        </td>
        <td valign="top" width="190">
        <h2 align="center"><a title="SSC NER Region Admit Card 2021" href="https://ssc.nic.in/Portal/AdmitCard" target="_blank"><b>Click Here</b></a></h2>
        </td>
        </tr>
        <tr>
        <td valign="top" width="269">
        <p align="center">Maharashtra, Gujrat,Goa</p>
        </td>
        <td colspan="4" valign="top" width="213">
        <p align="center">SSC Western Region WR GD Constable Exam Admit Card 2021</p>
        </td>
        <td valign="top" width="190">
        <h2 align="center"><a title="SSC WR Region Admit Card 2021" href="https://www.sscwr.net/notice_detail.php?noticeID=1329" target="_blank"><b>Click Here</b></a></h2>
        </td>
        </tr>
        <tr>
        <td valign="top" width="269">
        <p align="center">Andhra Pradesh, Punduchery, Tamilnadu</p>
        </td>
        <td colspan="4" valign="top" width="213">
        <p align="center">SSC Southern Region SR Chennai GD Constable Exam Admit Card Status 2021</p>
        </td>
        <td valign="top" width="190">
        <h2 align="center"><a title="SSC SR Region Admit Card 2021" href="http://www.sscsr.gov.in/CONSTABLES-2021-EXAMINATION-TIER-I-CBE-KNOW-YOUR-ROLLNO-n-EXAMINATION-DATE-n-TIME-n-CITY-GET.htm" target="_blank"><b>Click Here</b></a></h2>
        </td>
        </tr>
        <tr>
        <td colspan="6" valign="top" width="671">
        <h2 align="center"><span style="color: #008000;"><b>Some Useful Important Links</b></span><b></b></h2>
        </td>
        </tr>
        <tr>
        <td colspan="4" valign="top" width="375">
        <h2 align="center"><span style="color: #008080;"><b>Join Our Telegram Channel</b></span><b></b></h2>
        </td>
        <td colspan="2" valign="top" width="296">
        <h2 align="center"><b><a title="Join Sarkari Result Official Telegram Page" href="https://t.me/sarkari" target="_blank">Click Here</a></b></h2>
        </td>
        </tr>
        <tr>
        <td colspan="4" valign="top" width="375">
        <h2 align="center"><span style="color: #ff00ff;"><b>How to Check Form Status (Video Hindi) </b></span><b></b></h2>
        </td>
        <td colspan="2" valign="top" width="296">
        <h2 align="center"><b><a title="SSC GD Form Status 2021" href="https://www.youtube.com/watch?v=xUMmJ0wkDGY" target="_blank">Click Here</a></b></h2>
        </td>
        </tr>
        <tr>
        <td colspan="4" valign="top" width="375">
        <h2 align="center"><span style="color: #ff00ff;"><b>Check Vacancy Details &amp; Syllabus Download</b></span><b></b></h2>
        </td>
        <td colspan="2" valign="top" width="296">
        <h2 align="center"><b><a title="SSC GD Vacancy Details 2021" href="https://www.sarkariresult.com/ssc/ssc-gd-constable-2021/" target="_blank">Click Here</a></b></h2>
        </td>
        </tr>
        <tr>
        <td colspan="4" valign="top" width="375">
        <h2 align="center"><span style="color: #ff00ff;"><b>Download Notice for Exam Date</b></span><b></b></h2>
        </td>
        <td colspan="2" valign="top" width="296">
        <h2 align="center"><b><a title="SSC Exam Notice 2021" href="https://www.sarkariresults.org.in/wp-content/uploads/2021/10/Examinations_Skill_Tests_in_the_months_of_November_and_December2021_07092021-scaled.jpg" target="_blank">Click Here</a></b></h2>
        </td>
        </tr>
        <tr>
        <td colspan="4" valign="top" width="375">
        <h2 align="center"><span style="color: #ff00ff;"><b>Official Website</b></span><b></b></h2>
        </td>
        <td colspan="2" valign="top" width="296">
        <h2 align="center"><b><a title="SSC Official Website 2021" href="https://ssc.nic.in/" target="_blank">Click Here </a></b></h2>
        </td>
        </tr>
        </tbody>
        </table>
        `,
        "name": "UPSEE Round 2 Seat Allotment OP BOLTE 2020",
        "categoryId": "619b9e4e274be3e19b84f2c0",
        "shortInfo": "Uttar Pradesh Power Corporation Limited (UPPCL) has Recently Uploaded Result for the Post of Lekha Lipik (102 Post) Recruitment 2020. Those Candidates Who have Appeared in this Recruitment can Download Result."
    }
    const response = await axios.post('http://127.0.0.1:8000/api/add-record', data)
    res.send(response.status)

})


SERVER_PORT = process.env.PORT || 8000;
// Starting the app
app.listen(SERVER_PORT, function () {
    console.log("Server is listening at port:" + SERVER_PORT);
});