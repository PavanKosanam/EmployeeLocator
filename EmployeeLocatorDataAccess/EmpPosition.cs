//------------------------------------------------------------------------------
// <auto-generated>
//     This code was generated from a template.
//
//     Manual changes to this file may cause unexpected behavior in your application.
//     Manual changes to this file will be overwritten if the code is regenerated.
// </auto-generated>
//------------------------------------------------------------------------------

namespace EmployeeLocatorDataAccess
{
    using System;
    using System.Collections.Generic;
    
    public partial class EmpPosition
    {
        public int ID { get; set; }
        public int PositionID { get; set; }
        public Nullable<int> EmpID { get; set; }
    
        public virtual Employee Employee { get; set; }
        public virtual Position Position { get; set; }
    }
}
