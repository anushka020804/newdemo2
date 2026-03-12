import { motion } from "motion/react";
import { 
  Building2, 
  Calendar, 
  FileText, 
  IndianRupee,
  CheckCircle2,
  Award,
  Shield,
  Users,
  TrendingUp
} from "lucide-react";

interface FormalBidDocumentProps {
  tenderName: string;
  organization: string;
  value: string;
  submissionDate: string;
}

export function FormalBidDocument({ tenderName, organization, value, submissionDate }: FormalBidDocumentProps) {
  return (
    <div className="bg-white text-gray-900 max-w-4xl mx-auto">
      {/* Document Header - Letterhead Style */}
      <div className="border-b-4 border-indigo-600 pb-6 mb-8">
        <div className="flex items-start justify-between mb-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl text-indigo-900">ABC Industries Private Limited</h1>
                <p className="text-sm text-gray-600">ISO 9001:2015 Certified</p>
              </div>
            </div>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Plot No. 45, Industrial Area, Phase-2</p>
              <p>Bangalore, Karnataka - 560058</p>
              <p>Email: bids@abcindustries.com | Phone: +91-80-2345-6789</p>
              <p>GST: 29AABCA1234C1Z5 | PAN: AABCA1234C</p>
            </div>
          </div>
          <div className="text-right text-sm text-gray-600">
            <p className="mb-1">Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
            <p>Ref: BID/KPD/2026/001</p>
          </div>
        </div>
      </div>

      {/* Subject Line */}
      <div className="mb-8">
        <p className="text-sm text-gray-600 mb-2">To,</p>
        <p className="mb-2"><strong>{organization}</strong></p>
        <p className="text-sm text-gray-600 mb-4">Karnataka, India</p>
        
        <div className="bg-gray-50 border-l-4 border-indigo-600 p-4 mb-4">
          <p className="text-sm text-gray-600 mb-1"><strong>Subject:</strong></p>
          <p className="text-gray-900">Technical and Financial Bid for {tenderName}</p>
        </div>
        
        <p className="text-gray-700 mb-4">Dear Sir/Madam,</p>
        <p className="text-gray-700 leading-relaxed mb-4">
          We, <strong>ABC Industries Private Limited</strong>, hereby submit our bid for the above-mentioned tender. 
          We confirm that we have carefully read and understood all the terms and conditions, technical specifications, 
          and requirements mentioned in the tender document and agree to abide by them.
        </p>
      </div>

      {/* Section 1: Executive Summary */}
      <div className="mb-8 page-break">
        <div className="flex items-center gap-3 mb-4 pb-2 border-b-2 border-indigo-200">
          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 text-indigo-600" />
          </div>
          <h2 className="text-xl text-indigo-900">1. Executive Summary</h2>
        </div>
        
        <div className="space-y-4 text-gray-700 leading-relaxed">
          <p>
            ABC Industries Private Limited is pleased to submit this comprehensive bid proposal for the supply and 
            installation of industrial valves for the Karnataka Public Works Department. With over 15 years of experience 
            in manufacturing and supplying high-quality industrial valves, we are confident in our ability to meet and 
            exceed the requirements outlined in the tender document.
          </p>
          
          <div className="grid grid-cols-2 gap-4 my-6">
            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
              <p className="text-sm text-indigo-700 mb-1">Bid Value</p>
              <p className="text-2xl text-indigo-900">{value}</p>
            </div>
            <div className="bg-indigo-50 rounded-lg p-4 border border-indigo-100">
              <p className="text-sm text-indigo-700 mb-1">Delivery Timeline</p>
              <p className="text-2xl text-indigo-900">90 Days</p>
            </div>
          </div>

          <p>
            Our proposed solution includes supply of 500+ industrial valves conforming to IS 14846:2000 standards, 
            complete installation and commissioning, testing and quality certification, comprehensive warranty coverage, 
            and dedicated after-sales support.
          </p>
        </div>
      </div>

      {/* Section 2: Company Profile */}
      <div className="mb-8 page-break">
        <div className="flex items-center gap-3 mb-4 pb-2 border-b-2 border-indigo-200">
          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
            <Building2 className="w-4 h-4 text-indigo-600" />
          </div>
          <h2 className="text-xl text-indigo-900">2. Company Profile</h2>
        </div>

        <div className="space-y-4 text-gray-700 leading-relaxed">
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-6 border border-indigo-100 mb-6">
            <h3 className="text-lg text-indigo-900 mb-4">Company Overview</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600 mb-1">Company Name</p>
                <p className="text-gray-900">ABC Industries Private Limited</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Year of Establishment</p>
                <p className="text-gray-900">2010</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Legal Status</p>
                <p className="text-gray-900">Private Limited Company</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Annual Turnover (FY 2025-26)</p>
                <p className="text-gray-900">₹12.5 Crores</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Number of Employees</p>
                <p className="text-gray-900">150+</p>
              </div>
              <div>
                <p className="text-gray-600 mb-1">Manufacturing Facility</p>
                <p className="text-gray-900">5000 sq.m in Bangalore</p>
              </div>
            </div>
          </div>

          <h4 className="text-base text-gray-900 mb-2">About Us</h4>
          <p>
            Established in 2010, ABC Industries Private Limited has emerged as a leading manufacturer and supplier 
            of industrial valves and allied products in India. Our state-of-the-art manufacturing facility in Bangalore 
            is equipped with advanced machinery and quality control systems to ensure precision engineering and 
            international quality standards.
          </p>

          <h4 className="text-base text-gray-900 mb-2 mt-4">Core Competencies</h4>
          <ul className="list-none space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Design, manufacture, and supply of industrial valves (2" to 48" sizes)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Compliance with IS, DIN, ANSI, and BS standards</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>Installation, commissioning, and after-sales support</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <span>In-house testing facilities with certified quality assurance</span>
            </li>
          </ul>

          <h4 className="text-base text-gray-900 mb-2 mt-4">Certifications</h4>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-green-50 rounded-lg p-3 border border-green-200 text-center">
              <Award className="w-6 h-6 text-green-600 mx-auto mb-1" />
              <p className="text-sm text-green-900">ISO 9001:2015</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3 border border-green-200 text-center">
              <Shield className="w-6 h-6 text-green-600 mx-auto mb-1" />
              <p className="text-sm text-green-900">ISO 14001:2015</p>
            </div>
            <div className="bg-green-50 rounded-lg p-3 border border-green-200 text-center">
              <CheckCircle2 className="w-6 h-6 text-green-600 mx-auto mb-1" />
              <p className="text-sm text-green-900">NSIC Certified</p>
            </div>
          </div>
        </div>
      </div>

      {/* Section 3: Previous Experience */}
      <div className="mb-8 page-break">
        <div className="flex items-center gap-3 mb-4 pb-2 border-b-2 border-indigo-200">
          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
            <TrendingUp className="w-4 h-4 text-indigo-600" />
          </div>
          <h2 className="text-xl text-indigo-900">3. Previous Experience & References</h2>
        </div>

        <div className="space-y-4 text-gray-700">
          <p className="mb-4">
            We have successfully executed similar projects for various government and private sector organizations. 
            Below are some of our key projects:
          </p>

          <div className="space-y-4">
            {/* Project 1 */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-base text-gray-900">Tamil Nadu Water Supply Project</h4>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Completed</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Client</p>
                  <p className="text-gray-900">Tamil Nadu Water Board</p>
                </div>
                <div>
                  <p className="text-gray-600">Value</p>
                  <p className="text-gray-900">₹38,50,000</p>
                </div>
                <div>
                  <p className="text-gray-600">Year</p>
                  <p className="text-gray-900">2024-2025</p>
                </div>
                <div>
                  <p className="text-gray-600">Scope</p>
                  <p className="text-gray-900">Supply of 400+ Valves</p>
                </div>
              </div>
            </div>

            {/* Project 2 */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-base text-gray-900">Maharashtra Irrigation Department</h4>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Completed</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Client</p>
                  <p className="text-gray-900">Maharashtra Irrigation Dept</p>
                </div>
                <div>
                  <p className="text-gray-600">Value</p>
                  <p className="text-gray-900">₹52,00,000</p>
                </div>
                <div>
                  <p className="text-gray-600">Year</p>
                  <p className="text-gray-900">2023-2024</p>
                </div>
                <div>
                  <p className="text-gray-600">Scope</p>
                  <p className="text-gray-900">Supply & Installation</p>
                </div>
              </div>
            </div>

            {/* Project 3 */}
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-base text-gray-900">Bangalore Metro Water Works</h4>
                <span className="text-xs text-green-600 bg-green-100 px-2 py-1 rounded">Completed</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-gray-600">Client</p>
                  <p className="text-gray-900">BWSSB</p>
                </div>
                <div>
                  <p className="text-gray-600">Value</p>
                  <p className="text-gray-900">₹41,20,000</p>
                </div>
                <div>
                  <p className="text-gray-600">Year</p>
                  <p className="text-gray-900">2023</p>
                </div>
                <div>
                  <p className="text-gray-600">Scope</p>
                  <p className="text-gray-900">Supply of Valves & Fittings</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Technical Proposal */}
      <div className="mb-8 page-break">
        <div className="flex items-center gap-3 mb-4 pb-2 border-b-2 border-indigo-200">
          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
            <Shield className="w-4 h-4 text-indigo-600" />
          </div>
          <h2 className="text-xl text-indigo-900">4. Technical Proposal</h2>
        </div>

        <div className="space-y-4 text-gray-700 leading-relaxed">
          <h4 className="text-base text-gray-900 mb-2">4.1 Technical Specifications</h4>
          <p>
            We propose to supply industrial valves that fully comply with all technical specifications mentioned 
            in the tender document. Our valves meet IS 14846:2000 standards and are manufactured using high-grade materials.
          </p>

          <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 my-4">
            <h5 className="text-sm text-blue-900 mb-3">Valve Specifications</h5>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-blue-200">
                <tr>
                  <td className="py-2 text-blue-800">Body Material</td>
                  <td className="py-2 text-blue-900 text-right">Cast Iron / Ductile Iron (IS 1865)</td>
                </tr>
                <tr>
                  <td className="py-2 text-blue-800">Trim Material</td>
                  <td className="py-2 text-blue-900 text-right">Bronze / Stainless Steel</td>
                </tr>
                <tr>
                  <td className="py-2 text-blue-800">Working Pressure</td>
                  <td className="py-2 text-blue-900 text-right">PN 10/16</td>
                </tr>
                <tr>
                  <td className="py-2 text-blue-800">Connection Type</td>
                  <td className="py-2 text-blue-900 text-right">Flanged as per IS 1538</td>
                </tr>
                <tr>
                  <td className="py-2 text-blue-800">Coating</td>
                  <td className="py-2 text-blue-900 text-right">Epoxy (200 microns)</td>
                </tr>
                <tr>
                  <td className="py-2 text-blue-800">Testing</td>
                  <td className="py-2 text-blue-900 text-right">Hydrostatic as per IS 14846</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4 className="text-base text-gray-900 mb-2 mt-6">4.2 Quality Assurance</h4>
          <p>
            Every valve undergoes rigorous quality checks at multiple stages:
          </p>
          <ul className="list-none space-y-2 mt-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <span>Raw material inspection and certification verification</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <span>In-process quality control at each manufacturing stage</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <span>100% hydrostatic testing and dimensional checks</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <span>Third-party inspection (if required by client)</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <span>Final dispatch inspection and test certificate issuance</span>
            </li>
          </ul>

          <h4 className="text-base text-gray-900 mb-2 mt-6">4.3 Implementation Plan</h4>
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mt-2">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-2 text-gray-900">Phase</th>
                  <th className="text-left py-2 text-gray-900">Activity</th>
                  <th className="text-right py-2 text-gray-900">Timeline</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="py-2 text-gray-700">Phase 1</td>
                  <td className="py-2 text-gray-700">Order Processing & Material Procurement</td>
                  <td className="py-2 text-gray-700 text-right">Week 1-2</td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-700">Phase 2</td>
                  <td className="py-2 text-gray-700">Manufacturing & Quality Testing</td>
                  <td className="py-2 text-gray-700 text-right">Week 3-8</td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-700">Phase 3</td>
                  <td className="py-2 text-gray-700">Dispatch & Delivery to Site</td>
                  <td className="py-2 text-gray-700 text-right">Week 9-10</td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-700">Phase 4</td>
                  <td className="py-2 text-gray-700">Installation & Commissioning</td>
                  <td className="py-2 text-gray-700 text-right">Week 11-12</td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-700">Phase 5</td>
                  <td className="py-2 text-gray-700">Testing & Handover</td>
                  <td className="py-2 text-gray-700 text-right">Week 13</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Section 5: Financial Proposal */}
      <div className="mb-8 page-break">
        <div className="flex items-center gap-3 mb-4 pb-2 border-b-2 border-indigo-200">
          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
            <IndianRupee className="w-4 h-4 text-indigo-600" />
          </div>
          <h2 className="text-xl text-indigo-900">5. Financial Proposal</h2>
        </div>

        <div className="space-y-4 text-gray-700">
          <h4 className="text-base text-gray-900 mb-2">5.1 Price Breakdown</h4>
          
          <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-lg p-6 border border-indigo-200">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-indigo-300">
                  <th className="text-left py-3 text-indigo-900">Item Description</th>
                  <th className="text-center py-3 text-indigo-900">Quantity</th>
                  <th className="text-right py-3 text-indigo-900">Rate (₹)</th>
                  <th className="text-right py-3 text-indigo-900">Amount (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-indigo-200">
                <tr>
                  <td className="py-3 text-gray-700">Industrial Valves (2" size)</td>
                  <td className="py-3 text-center text-gray-700">150</td>
                  <td className="py-3 text-right text-gray-700">3,500</td>
                  <td className="py-3 text-right text-gray-900">5,25,000</td>
                </tr>
                <tr>
                  <td className="py-3 text-gray-700">Industrial Valves (4" size)</td>
                  <td className="py-3 text-center text-gray-700">200</td>
                  <td className="py-3 text-right text-gray-700">6,800</td>
                  <td className="py-3 text-right text-gray-900">13,60,000</td>
                </tr>
                <tr>
                  <td className="py-3 text-gray-700">Industrial Valves (6" size)</td>
                  <td className="py-3 text-center text-gray-700">100</td>
                  <td className="py-3 text-right text-gray-700">11,200</td>
                  <td className="py-3 text-right text-gray-900">11,20,000</td>
                </tr>
                <tr>
                  <td className="py-3 text-gray-700">Industrial Valves (8" size)</td>
                  <td className="py-3 text-center text-gray-700">50</td>
                  <td className="py-3 text-right text-gray-700">15,800</td>
                  <td className="py-3 text-right text-gray-900">7,90,000</td>
                </tr>
                <tr>
                  <td className="py-3 text-gray-700">Installation & Commissioning</td>
                  <td className="py-3 text-center text-gray-700">1 Lot</td>
                  <td className="py-3 text-right text-gray-700">-</td>
                  <td className="py-3 text-right text-gray-900">3,50,000</td>
                </tr>
                <tr>
                  <td className="py-3 text-gray-700">Testing & Certification</td>
                  <td className="py-3 text-center text-gray-700">1 Lot</td>
                  <td className="py-3 text-right text-gray-700">-</td>
                  <td className="py-3 text-right text-gray-900">1,20,000</td>
                </tr>
                <tr className="border-t-2 border-indigo-300">
                  <td colSpan={3} className="py-3 text-gray-900 text-right"><strong>Subtotal</strong></td>
                  <td className="py-3 text-right text-gray-900"><strong>42,65,000</strong></td>
                </tr>
                <tr>
                  <td colSpan={3} className="py-2 text-gray-700 text-right">GST @ 18%</td>
                  <td className="py-2 text-right text-gray-900">7,67,700</td>
                </tr>
                <tr className="border-t-2 border-indigo-400 bg-indigo-100">
                  <td colSpan={3} className="py-3 text-indigo-900 text-right text-lg"><strong>Grand Total</strong></td>
                  <td className="py-3 text-right text-indigo-900 text-lg"><strong>₹50,32,700</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

          <h4 className="text-base text-gray-900 mb-2 mt-6">5.2 Payment Terms</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Advance Payment</p>
              <p className="text-lg text-gray-900">30% on Purchase Order</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">On Delivery</p>
              <p className="text-lg text-gray-900">40% on Acceptance</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">On Installation</p>
              <p className="text-lg text-gray-900">20% on Completion</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
              <p className="text-sm text-gray-600 mb-1">Final Payment</p>
              <p className="text-lg text-gray-900">10% after Warranty</p>
            </div>
          </div>

          <h4 className="text-base text-gray-900 mb-2 mt-6">5.3 Validity</h4>
          <p>This bid is valid for <strong>90 days</strong> from the date of submission.</p>
        </div>
      </div>

      {/* Section 6: Terms & Conditions */}
      <div className="mb-8 page-break">
        <div className="flex items-center gap-3 mb-4 pb-2 border-b-2 border-indigo-200">
          <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
            <FileText className="w-4 h-4 text-indigo-600" />
          </div>
          <h2 className="text-xl text-indigo-900">6. Terms & Conditions</h2>
        </div>

        <div className="space-y-3 text-gray-700 text-sm leading-relaxed">
          <div className="flex items-start gap-2">
            <span className="text-indigo-600 flex-shrink-0">6.1</span>
            <p><strong>Warranty:</strong> All supplied valves come with a 12-month warranty from the date of installation against manufacturing defects.</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-indigo-600 flex-shrink-0">6.2</span>
            <p><strong>Delivery:</strong> Delivery will be made to the designated sites as per the schedule agreed upon with the client.</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-indigo-600 flex-shrink-0">6.3</span>
            <p><strong>Training:</strong> We will provide operational training to the client's technical staff at no additional cost.</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-indigo-600 flex-shrink-0">6.4</span>
            <p><strong>After-Sales Support:</strong> Our service team will be available for support and maintenance throughout the warranty period and beyond.</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-indigo-600 flex-shrink-0">6.5</span>
            <p><strong>Force Majeure:</strong> We shall not be held liable for delays due to circumstances beyond our control such as natural disasters, strikes, or government regulations.</p>
          </div>
          <div className="flex items-start gap-2">
            <span className="text-indigo-600 flex-shrink-0">6.6</span>
            <p><strong>Compliance:</strong> We confirm compliance with all statutory and regulatory requirements including labor laws and environmental regulations.</p>
          </div>
        </div>
      </div>

      {/* Declaration & Signature */}
      <div className="mb-8">
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg p-6 border border-gray-300">
          <h3 className="text-base text-gray-900 mb-3">Declaration</h3>
          <p className="text-sm text-gray-700 leading-relaxed mb-4">
            We hereby declare that all the information provided in this bid is true and accurate to the best of our knowledge. 
            We understand that any false information may lead to disqualification. We agree to abide by all terms and conditions 
            specified in the tender document.
          </p>

          <div className="mt-8 pt-6 border-t border-gray-300">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-sm text-gray-600 mb-1">Place: Bangalore</p>
                <p className="text-sm text-gray-600">Date: {new Date().toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' })}</p>
              </div>
              <div className="text-right">
                <div className="mb-12">
                  <p className="text-sm text-gray-500 italic">[Authorized Signature]</p>
                </div>
                <p className="text-sm text-gray-900"><strong>Mr. Rajesh Kumar</strong></p>
                <p className="text-sm text-gray-600">Managing Director</p>
                <p className="text-sm text-gray-600">ABC Industries Private Limited</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Company Seal Section */}
      <div className="border-t-2 border-gray-300 pt-6 text-center">
        <div className="inline-block border-2 border-indigo-600 rounded-lg px-8 py-4">
          <p className="text-xs text-gray-500 mb-2">COMPANY SEAL</p>
          <div className="w-24 h-24 mx-auto mb-2 border-2 border-indigo-300 rounded-full flex items-center justify-center">
            <Building2 className="w-12 h-12 text-indigo-400" />
          </div>
          <p className="text-xs text-indigo-600"><strong>ABC INDUSTRIES PVT LTD</strong></p>
        </div>
      </div>
    </div>
  );
}
